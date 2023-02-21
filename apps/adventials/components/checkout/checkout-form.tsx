import {
  Country,
  Language,
  PaymentMethod,
  ShippingOption,
  ShippingService,
} from '@castleadmin/checkout-domain';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Icon,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { brown } from '@mui/material/colors';
import AjvFormats from 'ajv-formats';
import { Trans, useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Controller,
  FormState,
  useForm,
  UseFormSetValue,
} from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import { v4 as uuidv4 } from 'uuid';
import { CheckoutFormData } from '../../checkout';
import { addCheckoutFormData } from '../../checkout.state';
import { useAppDispatch, useAppSelector } from '../../store';
import styles from './checkout-form.module.scss';

/* eslint-disable-next-line */
export interface CheckoutFormProps {}

export type CheckoutFormDataAndPrivacyPolicy = CheckoutFormData & {
  privacyPolicy: boolean;
};

export let formStateCheckoutForm: FormState<CheckoutFormDataAndPrivacyPolicy>;
export let setValueCheckoutForm: UseFormSetValue<CheckoutFormDataAndPrivacyPolicy>;

export function CheckoutForm(_props: CheckoutFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale as Language;

  const dispatch = useAppDispatch();
  const checkoutFormData: CheckoutFormData | undefined = useAppSelector(
    (state) => state.checkout.checkoutFormData
  );

  const defaultValues = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    businessName: '',
    streetAddress: '',
    zipCode: '',
    city: '',
    country: locale === Language.de ? Country.Germany : Country.UnitedStates,
    paymentMethod: PaymentMethod.playMoney,
    shippingOption: ShippingOption.standard,
    privacyPolicy: false,
  } as CheckoutFormDataAndPrivacyPolicy;

  const { control, formState, handleSubmit, setValue, watch } =
    useForm<CheckoutFormDataAndPrivacyPolicy>({
      mode: 'onChange',
      reValidateMode: 'onChange',
      defaultValues,
      values: {
        ...defaultValues,
        ...(checkoutFormData ?? {}),
        privacyPolicy: false,
      },
    });
  formStateCheckoutForm = formState;
  setValueCheckoutForm = setValue;
  const watchCountry = watch('country') as Country;

  const onValid = async (data: CheckoutFormDataAndPrivacyPolicy) => {
    const formData = { ...data };
    delete (formData as Partial<CheckoutFormDataAndPrivacyPolicy>)
      .privacyPolicy;

    dispatch(addCheckoutFormData(formData));

    await router.push({ pathname: `/checkout/${uuidv4()}`, query: {} });
  };

  const createTextField = (
    name:
      | 'firstName'
      | 'lastName'
      | 'emailAddress'
      | 'businessName'
      | 'streetAddress'
      | 'zipCode'
      | 'city',
    label: string,
    isRequired: boolean,
    validationRules: RegisterOptions,
    errorMessage: string
  ) => (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field: { value, onChange }, fieldState: { invalid } }) => (
        <TextField
          className={styles['text-field'] as string}
          value={value}
          onChange={onChange}
          error={invalid}
          label={label}
          helperText={invalid ? errorMessage : ' '}
          required={isRequired}
          variant="outlined"
          color="secondary"
        />
      )}
    />
  );

  const createSortedCountryList = () =>
    Object.values(Country)
      .map((country) => ({
        value: country,
        translation: t(`country${country}`),
      }))
      .sort((a, b) => a.translation.localeCompare(b.translation, locale));

  return (
    <form className={styles['checkout-form']} onSubmit={handleSubmit(onValid)}>
      <div className={styles['checkout-part']}>
        <Card
          className={styles['checkout-card'] as string}
          sx={{ bgcolor: 'menu.main', boxShadow: 4 }}
        >
          <CardContent
            className={styles['personal-form-card-content'] as string}
          >
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ fontSize: '1.125rem', fontWeight: '400' }}
            >
              <Trans>personalInformation</Trans>
            </Typography>
            <div className={styles['personal-form-container']}>
              <div className={styles['text-field-container']}>
                {createTextField(
                  'firstName',
                  t('firstName'),
                  true,
                  { required: true },
                  t('errorRequired')
                )}
                {createTextField(
                  'lastName',
                  t('lastName'),
                  true,
                  { required: true },
                  t('errorRequired')
                )}
              </div>
              <div className={styles['text-field-container']}>
                {createTextField(
                  'emailAddress',
                  t('email'),
                  true,
                  {
                    required: true,
                    pattern: AjvFormats.get('email') as RegExp,
                  },
                  t('errorEmail')
                )}
              </div>
              <div className={styles['text-field-container']}>
                {createTextField(
                  'businessName',
                  t('businessName'),
                  false,
                  {},
                  ''
                )}
              </div>
              <div className={styles['text-field-container']}>
                {createTextField(
                  'streetAddress',
                  t('streetAddress'),
                  true,
                  { required: true },
                  t('errorRequired')
                )}
              </div>
              <div className={styles['text-field-container']}>
                {createTextField(
                  'zipCode',
                  t('zipCode'),
                  true,
                  { required: true },
                  t('errorRequired')
                )}
                {createTextField(
                  'city',
                  t('city'),
                  true,
                  { required: true },
                  t('errorRequired')
                )}
              </div>
              <div className={styles['country-container']}>
                <Controller
                  name={'country'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormControl className={styles['country'] as string}>
                      <InputLabel id="country-label" color="label">
                        <Trans>country</Trans>
                      </InputLabel>
                      <Select
                        id="country-input"
                        label={t('country')}
                        labelId="country-label"
                        color="secondary"
                        value={value}
                        onChange={onChange}
                      >
                        {createSortedCountryList().map((country) => (
                          <MenuItem key={country.value} value={country.value}>
                            {country.translation}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div
        className={`${styles['checkout-part']} ${styles['options-checkout-part']}`}
      >
        <Card
          className={`${styles['checkout-card']} ${styles['options-checkout-card']}`}
          sx={{ bgcolor: 'menu.main', boxShadow: 4 }}
        >
          <CardContent>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ fontSize: '1.125rem', fontWeight: '400' }}
            >
              <Trans>options</Trans>
            </Typography>
            <div className={styles['options-form-container']}>
              <div className={styles['options-form-line']}>
                <Controller
                  name={'paymentMethod'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormControl className={styles['payment-method'] as string}>
                      <InputLabel id="payment-method-label" color="label">
                        <Trans>paymentMethod</Trans>
                      </InputLabel>
                      <Select
                        id="payment-method-input"
                        label={t('paymentMethod')}
                        labelId="payment-method-label"
                        color="secondary"
                        value={value}
                        onChange={onChange}
                      >
                        <MenuItem value={PaymentMethod.playMoney}>
                          <Trans>paymentPlayMoney</Trans>
                        </MenuItem>
                        <MenuItem value={PaymentMethod.sweets}>
                          <Trans>paymentSweets</Trans>
                        </MenuItem>
                        <MenuItem value={PaymentMethod.greetingCards}>
                          <Trans>paymentGreetingCards</Trans>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
              <div className={styles['options-form-line']}>
                <Controller
                  name={'shippingOption'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormControl
                      className={styles['shipping-option'] as string}
                    >
                      <InputLabel id="shipping-option-label" color="label">
                        <Trans>shippingOption</Trans>
                      </InputLabel>
                      <Select
                        id="shipping-option-input"
                        label={t('shippingOption')}
                        labelId="shipping-option-label"
                        color="secondary"
                        value={value}
                        onChange={onChange}
                      >
                        <MenuItem value={ShippingOption.standard}>
                          <Trans
                            values={{
                              price: ShippingService.getShippingPriceEurString(
                                watchCountry,
                                ShippingOption.standard,
                                locale
                              ),
                            }}
                          >
                            shippingStandard
                          </Trans>
                        </MenuItem>
                        <MenuItem value={ShippingOption.express}>
                          <Trans
                            values={{
                              price: ShippingService.getShippingPriceEurString(
                                watchCountry,
                                ShippingOption.express,
                                locale
                              ),
                            }}
                          >
                            shippingExpress
                          </Trans>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className={styles['submit-checkout-container']}>
          <Card
            className={styles['checkout-card'] as string}
            sx={{ bgcolor: 'menu.main', boxShadow: 4 }}
          >
            <CardContent className={styles['submit-card-content'] as string}>
              <div className={styles['privacy-policy-container']}>
                <Controller
                  name={'privacyPolicy'}
                  control={control}
                  rules={{ validate: (value) => value === true }}
                  render={({
                    field: { value, onChange },
                    fieldState: { invalid },
                  }) => (
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="checkbox"
                            size="small"
                            checked={value}
                            onChange={onChange}
                          />
                        }
                        label={
                          <Box
                            component="span"
                            color={invalid ? 'error.main' : 'text.primary'}
                          >
                            <Trans
                              i18nKey="acceptPrivacyPolicy"
                              components={{
                                ref: (
                                  <Link
                                    style={{
                                      color: invalid ? 'inherit' : brown['600'],
                                    }}
                                    href={{
                                      pathname: '/privacy-policy',
                                      query: {},
                                    }}
                                    rel="noreferrer noopener"
                                    target="_blank"
                                  ></Link>
                                ),
                              }}
                            ></Trans>
                          </Box>
                        }
                      />
                    </FormGroup>
                  )}
                />
              </div>
              <div className={styles['submit-button-container']}>
                <Button
                  id="checkout-form-submit-button"
                  className={styles['submit-button'] as string}
                  type="submit"
                  variant="outlined"
                  color="button"
                  startIcon={
                    <Icon className="adventials-material-symbols-outlined">
                      list_alt_outlined
                    </Icon>
                  }
                >
                  <Trans>toOrderOverview</Trans>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

export default CheckoutForm;
