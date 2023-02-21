import {
  CreateOrder,
  Language,
  PriceService,
} from '@castleadmin/checkout-domain';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { captureException } from '@sentry/nextjs';
import { Trans } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  ApproveCheckoutRequest,
  CheckoutHeartbeatRequest,
  CheckoutResponse,
  RejectCheckoutRequest,
} from '../../api';
import { removeAllFromCart } from '../../cart.state';
import {
  CheckoutFormData,
  DeliveryDateOrder,
  toDeliveryDateOrder,
} from '../../checkout';
import { requestCheckout } from '../../checkout-request';
import { getEffectImage128, getItemImage128 } from '../../image';
import { CartItem, getItemName, getItemPriceEur } from '../../item';
import { useAppDispatch, useAppSelector } from '../../store';
import styles from './checkout-approval.module.scss';

/* eslint-disable-next-line */
export interface CheckoutApprovalProps {
  transactionId: string;
}

export let stateCheckoutApproval: {
  isLoading: boolean;
  error: Error | undefined;
  response: CheckoutResponse | undefined;
  deliveryDateOrder: DeliveryDateOrder | undefined;
  isCompleted: boolean;
};

export function CheckoutApproval(props: CheckoutApprovalProps) {
  const router = useRouter();
  const locale = router.locale as Language;

  const [state, setState] = useState({
    isLoading: true,
    error: undefined as Error | undefined,
    response: undefined as CheckoutResponse | undefined,
    deliveryDateOrder: undefined as DeliveryDateOrder | undefined,
    isCompleted: false,
  });
  stateCheckoutApproval = state;

  const cartItems: CartItem[] = useAppSelector((state) => state.cart.cartItems);
  const checkoutFormData: CheckoutFormData | undefined = useAppSelector(
    (state) => state.checkout.checkoutFormData
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (cartItems.length === 0) {
      const errorText = 'Invalid state: Cart Items length is zero';
      console.error(errorText);
      captureException(errorText);

      return;
    }
    if (!checkoutFormData) {
      const errorText = 'Invalid state: Checkout Form Data is undefined';
      console.error(errorText);
      captureException(errorText);

      return;
    }

    const createOrder: CreateOrder = {
      ...checkoutFormData,
      language: locale,
      items: cartItems.map((cartItem) => ({
        itemId: cartItem.item._id,
        quantity: cartItem.quantity,
      })),
    };

    requestCheckout(props.transactionId, createOrder)
      .then(async (response) => {
        const deliveryDateOrder = toDeliveryDateOrder(
          response.approvalOrder,
          locale
        );

        setState({
          ...state,
          isLoading: false,
          response,
          deliveryDateOrder,
        });
      })
      .catch((error) => {
        console.error(error);
        captureException(error);

        setState({ ...state, isLoading: false, error });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApproveCheckout = async () => {
    if (state.response?.token) {
      await fetch('/api/approve-checkout', {
        mode: 'same-origin',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: props.transactionId,
          token: state.response.token,
        } as ApproveCheckoutRequest),
      });

      setState({ ...state, isCompleted: true });
      dispatch(removeAllFromCart());
    } else {
      const errorText = `Response has no token ${JSON.stringify(
        state.response,
        null,
        2
      )}`;
      console.error(errorText);
      captureException(errorText);
    }
  };

  const onRejectCheckout = async () => {
    if (state.response) {
      if (state.response.token) {
        await fetch('/api/reject-checkout', {
          mode: 'same-origin',
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionId: props.transactionId,
            token: state.response.token,
          } as RejectCheckoutRequest),
        });
      } else {
        const errorText = `Response has no token ${JSON.stringify(
          state.response,
          null,
          2
        )}`;
        console.error(errorText);
        captureException(errorText);
      }
    }

    await router.push({ pathname: '/', query: {} });
  };

  const onCheckoutHearbeat = async () => {
    if (stateCheckoutApproval.response && !stateCheckoutApproval.isCompleted) {
      if (stateCheckoutApproval.response.token) {
        await fetch('/api/checkout-heartbeat', {
          mode: 'same-origin',
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionId: props.transactionId,
            token: stateCheckoutApproval.response.token,
          } as CheckoutHeartbeatRequest),
        });
      } else {
        const errorText = `Response has no token ${JSON.stringify(
          state.response,
          null,
          2
        )}`;
        console.error(errorText);
        captureException(errorText);
      }
    }
  };

  const heartbeatInterval = 24 * 1000; // 30 seconds timeout * 0.8 = 24 seconds
  useEffect(() => {
    const intervalId = setInterval(async () => {
      await onCheckoutHearbeat();
    }, heartbeatInterval);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onContinueShopping = async () => {
    await router.push({ pathname: '/', query: {} });
  };

  const cardContent = () => {
    if (state.isLoading) {
      return (
        <div className={styles['is-loading-container']}>
          <CircularProgress size={64} />
        </div>
      );
    } else if (state.error) {
      return (
        <div className={styles['error-container']}>
          <Typography
            variant="h6"
            color="text.primary"
            sx={{ fontSize: '1.125rem', fontWeight: '500' }}
          >
            <Trans>anErrorHasOccurred</Trans>
          </Typography>
          <Typography>
            <Trans>anErrorHasOccurredDescription</Trans>
          </Typography>
        </div>
      );
    } else if (state.isCompleted) {
      return (
        <div className={styles['is-completed-container']}>
          <Box
            className={styles['is-completed-icon-container'] as string}
            color="primary.light"
          >
            <Icon
              className={`adventials-material-symbols-outlined ${styles['is-completed-icon']}`}
            >
              check_circle_outlined
            </Icon>
          </Box>
          <div className={styles['is-completed-text-container']}>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ fontSize: '1.125rem', fontWeight: '500' }}
            >
              <Trans>orderCompleted</Trans>
            </Typography>
            <Typography>
              <Trans>orderCompletedDescription</Trans>
            </Typography>
          </div>
        </div>
      );
    }

    return (
      <div className={styles['overview-container']}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.1875rem',
            fontWeight: '400',
            marginBottom: '20px',
          }}
        >
          <Trans>orderOverview</Trans>
        </Typography>
        {state.response && (
          <div className={styles['order-details']}>
            <Box
              className={styles['order-delivery-address-container'] as string}
              color="text.secondary"
            >
              <Box
                className={styles['order-delivery-address-title'] as string}
                color="text.primary"
              >
                <Trans>deliveryAddress</Trans>
              </Box>
              <div>
                {state.response.approvalOrder.firstName}{' '}
                {state.response.approvalOrder.lastName}
              </div>
              {state.response.approvalOrder.businessName && (
                <div>{state.response.approvalOrder.businessName}</div>
              )}
              <div>{state.response.approvalOrder.streetAddress}</div>
              <div>
                {state.response.approvalOrder.zipCode}{' '}
                {state.response.approvalOrder.city}
              </div>
              <div>{state.response.approvalOrder.country}</div>
            </Box>
            <Box
              className={styles['additional-container'] as string}
              color="text.secondary"
            >
              <div className={styles['payment-method-container']}>
                <Box
                  className={styles['payment-method-title'] as string}
                  color="text.primary"
                >
                  <Trans>paymentMethod</Trans>
                </Box>
                <div>
                  <Trans>
                    payment
                    {state.response.approvalOrder.paymentMethod
                      .substring(0, 1)
                      .toUpperCase()}
                    {state.response.approvalOrder.paymentMethod.substring(1)}
                  </Trans>
                </div>
              </div>
              <div className={styles['email-container']}>
                <Box
                  className={styles['email-title'] as string}
                  color="text.primary"
                >
                  <Trans>email</Trans>
                </Box>
                <div>{state.response.approvalOrder.emailAddress}</div>
              </div>
            </Box>
          </div>
        )}
        {state.deliveryDateOrder && (
          <div className={styles['delivery-date-order']}>
            {state.deliveryDateOrder.groups.map((group) => (
              <div
                key={group.deliveryDate}
                className={styles['delivery-date-group']}
              >
                <Typography
                  variant="h6"
                  className={styles['delivery-date-group-title'] as string}
                >
                  <Trans>estimatedDeliveryDate</Trans>{' '}
                  {new Date(group.deliveryDate).toLocaleDateString(locale)}
                </Typography>
                <List className={styles['delivery-date-group-list'] as string}>
                  {group.items.map((deliveryDateItem) => (
                    <ListItem
                      key={deliveryDateItem.item._id}
                      className={
                        styles['delivery-date-group-list-item'] as string
                      }
                    >
                      <ListItemIcon sx={{ mr: 1 }}>
                        <div className={styles['image-container']}>
                          {deliveryDateItem.item.effect && (
                            <Image
                              className={styles['effect-image']}
                              src={getEffectImage128(deliveryDateItem.item)}
                              width={64}
                              height={64}
                              alt={getItemName(deliveryDateItem.item, locale)}
                            />
                          )}
                          <Image
                            className={styles['item-image']}
                            src={getItemImage128(deliveryDateItem.item)}
                            width={64}
                            height={64}
                            alt={getItemName(deliveryDateItem.item, locale)}
                          />
                        </div>
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ component: 'div' }}
                        primary={
                          <span className={styles['item-title']}>
                            {getItemName(deliveryDateItem.item, locale)}
                          </span>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                        secondary={
                          <>
                            <Box
                              id={`checkout-approval-is-in-stock-item-${deliveryDateItem.item._id}`}
                              className={styles['is-in-stock'] as string}
                              color={
                                deliveryDateItem.item.isInStock
                                  ? 'primary.light'
                                  : 'text.secondary'
                              }
                            >
                              <Trans>
                                {deliveryDateItem.item.isInStock
                                  ? 'inStock'
                                  : 'notInStock'}
                              </Trans>
                            </Box>
                            <div className={styles['price-container']}>
                              <div>
                                {deliveryDateItem.quantity} x{' '}
                                {getItemPriceEur(deliveryDateItem.item, locale)}
                              </div>
                              <Box color="text.primary">
                                {PriceService.getItemsTotalPriceEurString(
                                  [deliveryDateItem],
                                  locale
                                )}
                              </Box>
                            </div>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            ))}
            <Divider />
            <div className={styles['delivery-date-order-total-price-items']}>
              <div className={styles['delivery-date-order-price-title']}>
                <Trans>itemsTotalPrice</Trans>
              </div>
              <div>{state.deliveryDateOrder.totalPriceItemsEur}</div>
            </div>
            <div className={styles['delivery-date-order-shipping-price']}>
              <div className={styles['delivery-date-order-price-title']}>
                <Trans>{`shipping${state.deliveryDateOrder.shippingOption
                  .toString()
                  .substring(0, 1)
                  .toUpperCase()}${state.deliveryDateOrder.shippingOption
                  .toString()
                  .substring(1)}Price`}</Trans>
              </div>
              <div>{state.deliveryDateOrder.shippingPriceEur}</div>
            </div>
            <Divider />
            <div className={styles['delivery-date-order-total-price']}>
              <div className={styles['delivery-date-order-price-title']}>
                <Trans>totalPrice</Trans>
              </div>
              <div>{state.deliveryDateOrder.totalPriceEur}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles['checkout-approval']}>
      <Card sx={{ bgcolor: 'menu.main', boxShadow: 4 }}>
        <CardContent>{cardContent()}</CardContent>
        <CardActions>
          {state.isCompleted ? (
            <Button
              id="checkout-approval-continue-shopping-button"
              variant="outlined"
              color="button"
              onClick={onContinueShopping}
            >
              <Trans>continueShopping</Trans>
            </Button>
          ) : (
            <>
              <Button
                id="checkout-approval-reject-checkout-button"
                variant="text"
                color="button"
                onClick={onRejectCheckout}
              >
                <Trans>cancel</Trans>
              </Button>
              <Button
                id="checkout-approval-approve-checkout-button"
                variant="outlined"
                color="button"
                startIcon={
                  <Icon className="adventials-material-symbols-outlined">
                    check_circle_outlined
                  </Icon>
                }
                disabled={Boolean(state.error || !state.response?.token)}
                onClick={onApproveCheckout}
              >
                <Trans>placeYourOrder</Trans>
              </Button>
            </>
          )}
        </CardActions>
      </Card>
    </div>
  );
}

export default CheckoutApproval;
