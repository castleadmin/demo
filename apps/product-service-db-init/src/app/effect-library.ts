import { Category } from '@castleadmin/product-domain';

const weapons = [
  Category.axes,
  Category.hammers,
  Category.spears,
  Category.daggers,
  Category.swords,
];

const bows = [Category.bows];

const armors = [Category.armors, Category.helmets, Category.shields];

const wands = [Category.wands];

const scrolls = [Category.scrolls];

const potions = [Category.potions];

/**
 * Properties of a magical effect. The interface is only used during the generation process.
 */
export interface Effect {
  id: string;
  categories: Category[];
  effectNameDe: string;
  effectNameEnUs: string;
  nameDe0: string;
  nameDe1: string;
  nameDe2: string;
  nameEnUs0: string;
  nameEnUs1: string;
  nameEnUs2: string;
  descriptionDe0: string;
  descriptionDe1: string;
  descriptionDe2: string;
  descriptionEnUs0: string;
  descriptionEnUs1: string;
  descriptionEnUs2: string;
}

const effects: Effect[] = [
  {
    id: 'air-burst',
    categories: weapons.concat(wands, scrolls),
    effectNameDe: 'Luftdetonation',
    effectNameEnUs: 'Air Burst',
    nameDe0: 'der kleinen Luftdetonation',
    nameDe1: 'der Luftdetonation',
    nameDe2: 'der großen Luftdetonation',
    nameEnUs0: 'of lesser Air Burst',
    nameEnUs1: 'of Air Burst',
    nameEnUs2: 'of greater Air Burst',
    descriptionDe0:
      'Getroffene Gegner erleiden durch eine kleine Luftdetonation schaden und werden zurückgeworfen.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch eine Luftdetonation schaden und werden zurückgeworfen.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch eine große Luftdetonation schaden und werden zurückgeworfen.',
    descriptionEnUs0:
      'Attacked enemies suffer from a lesser air detonation and are thrown back.',
    descriptionEnUs1:
      'Attacked enemies suffer from an air detonation and are thrown back.',
    descriptionEnUs2:
      'Attacked enemies suffer from a greater air detonation and are thrown back.',
  },
  {
    id: 'acid-beam',
    categories: wands.concat(scrolls),
    effectNameDe: 'Säurestrahl',
    effectNameEnUs: 'Acid Beam',
    nameDe0: 'des kleinen Säurestrahls',
    nameDe1: 'des Säurestrahls',
    nameDe2: 'des großen Säurestrahls',
    nameEnUs0: 'of lesser Acid Beam',
    nameEnUs1: 'of Acid Beam',
    nameEnUs2: 'of greater Acid Beam',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Säurestrahl schaden.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch einen Säurestrahl schaden.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Säurestrahl schaden.',
    descriptionEnUs0: 'Attacked enemies suffer from a lesser acid beam.',
    descriptionEnUs1: 'Attacked enemies suffer from an acid beam.',
    descriptionEnUs2: 'Attacked enemies suffer from a greater acid beam.',
  },
  {
    id: 'ice-beam',
    categories: wands.concat(scrolls),
    effectNameDe: 'Eisstrahl',
    effectNameEnUs: 'Ice Beam',
    nameDe0: 'des kleinen Eisstrahls',
    nameDe1: 'des Eisstrahls',
    nameDe2: 'des großen Eisstrahls',
    nameEnUs0: 'of lesser Ice Beam',
    nameEnUs1: 'of Ice Beam',
    nameEnUs2: 'of greater Ice Beam',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Eisstrahl schaden.',
    descriptionDe1: 'Getroffene Gegner erleiden durch einen Eisstrahl schaden.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Eisstrahl schaden.',
    descriptionEnUs0: 'Attacked enemies suffer from a lesser ice beam.',
    descriptionEnUs1: 'Attacked enemies suffer from an ice beam.',
    descriptionEnUs2: 'Attacked enemies suffer from a greater ice beam.',
  },
  {
    id: 'fire-beam',
    categories: wands.concat(scrolls),
    effectNameDe: 'Feuerstrahl',
    effectNameEnUs: 'Fire Beam',
    nameDe0: 'des kleinen Feuerstrahls',
    nameDe1: 'des Feuerstrahls',
    nameDe2: 'des großen Feuerstrahls',
    nameEnUs0: 'of lesser Fire Beam',
    nameEnUs1: 'of Fire Beam',
    nameEnUs2: 'of greater Fire Beam',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Feuerstrahl schaden.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch einen Feuerstrahl schaden.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Feuerstrahl schaden.',
    descriptionEnUs0: 'Attacked enemies suffer from a lesser fire beam.',
    descriptionEnUs1: 'Attacked enemies suffer from a fire beam.',
    descriptionEnUs2: 'Attacked enemies suffer from a greater fire beam.',
  },
  {
    id: 'spirit-beam',
    categories: wands.concat(scrolls),
    effectNameDe: 'Magiestrahl',
    effectNameEnUs: 'Magic Beam',
    nameDe0: 'des kleinen Magiestrahls',
    nameDe1: 'des Magiestrahls',
    nameDe2: 'des großen Magiestrahls',
    nameEnUs0: 'of lesser Magic Beam',
    nameEnUs1: 'of Magic Beam',
    nameEnUs2: 'of greater Magic Beam',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Magiestrahl schaden.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch einen Magiestrahl schaden.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Magiestrahl schaden.',
    descriptionEnUs0: 'Attacked enemies suffer from a lesser magic beam.',
    descriptionEnUs1: 'Attacked enemies suffer from a magic beam.',
    descriptionEnUs2: 'Attacked enemies suffer from a greater magic beam.',
  },
  {
    id: 'acid-coat',
    categories: weapons,
    effectNameDe: 'Säuremantel',
    effectNameEnUs: 'Acid Coat',
    nameDe0: 'des kleinen Säuremantels',
    nameDe1: 'des Säuremantels',
    nameDe2: 'des großen Säuremantels',
    nameEnUs0: 'of lesser Acid Coat',
    nameEnUs1: 'of Acid Coat',
    nameEnUs2: 'of greater Acid Coat',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Säuremantel schaden.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch einen Säuremantel schaden.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Säuremantel schaden.',
    descriptionEnUs0: 'Attacked enemies suffer from a lesser acid coat.',
    descriptionEnUs1: 'Attacked enemies suffer from an acid coat.',
    descriptionEnUs2: 'Attacked enemies suffer from a greater acid coat.',
  },
  {
    id: 'ice-coat',
    categories: weapons,
    effectNameDe: 'Eismantel',
    effectNameEnUs: 'Ice Coat',
    nameDe0: 'des kleinen Eismantels',
    nameDe1: 'des Eismantels',
    nameDe2: 'des großen Eismantels',
    nameEnUs0: 'of lesser Ice Coat',
    nameEnUs1: 'of Ice Coat',
    nameEnUs2: 'of greater Ice Coat',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Eismantel schaden.',
    descriptionDe1: 'Getroffene Gegner erleiden durch einen Eismantel schaden.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Eismantel schaden.',
    descriptionEnUs0: 'Attacked enemies suffer from a lesser ice coat.',
    descriptionEnUs1: 'Attacked enemies suffer from an ice coat.',
    descriptionEnUs2: 'Attacked enemies suffer from a greater ice coat.',
  },
  {
    id: 'fire-coat',
    categories: weapons,
    effectNameDe: 'Feuermantel',
    effectNameEnUs: 'Fire Coat',
    nameDe0: 'des kleinen Feuermantels',
    nameDe1: 'des Feuermantels',
    nameDe2: 'des großen Feuermantels',
    nameEnUs0: 'of lesser Fire Coat',
    nameEnUs1: 'of Fire Coat',
    nameEnUs2: 'of greater Fire Coat',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Feuermantel schaden.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch einen Feuermantel schaden.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Feuermantel schaden.',
    descriptionEnUs0: 'Attacked enemies suffer from a lesser fire coat.',
    descriptionEnUs1: 'Attacked enemies suffer from a fire coat.',
    descriptionEnUs2: 'Attacked enemies suffer from a greater fire coat.',
  },
  {
    id: 'spirit-coat',
    categories: weapons,
    effectNameDe: 'Magiemantel',
    effectNameEnUs: 'Magic Coat',
    nameDe0: 'des kleinen Magiemantels',
    nameDe1: 'des Magiemantels',
    nameDe2: 'des großen Magiemantels',
    nameEnUs0: 'of lesser Magic Coat',
    nameEnUs1: 'of Magic Coat',
    nameEnUs2: 'of greater Magic Coat',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Magiemantel schaden.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch einen Magiemantel schaden.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Magiemantel schaden.',
    descriptionEnUs0: 'Attacked enemies suffer from a lesser magic coat.',
    descriptionEnUs1: 'Attacked enemies suffer from a magic coat.',
    descriptionEnUs2: 'Attacked enemies suffer from a greater magic coat.',
  },
  {
    id: 'fire-explosion',
    categories: bows.concat(wands, scrolls),
    effectNameDe: 'Feuerexplosion',
    effectNameEnUs: 'Fire Explosion',
    nameDe0: 'der kleinen Feuerexplosion',
    nameDe1: 'der Feuerexplosion',
    nameDe2: 'der großen Feuerexplosion',
    nameEnUs0: 'of lesser Fire Explosion',
    nameEnUs1: 'of Fire Explosion',
    nameEnUs2: 'of greater Fire Explosion',
    descriptionDe0:
      'Getroffene Gegner erleiden durch eine kleine Feuerexplosion schaden und werden zurückgeworfen.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch eine Feuerexplosion schaden und werden zurückgeworfen.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch eine große Feuerexplosion schaden und werden zurückgeworfen.',
    descriptionEnUs0:
      'Attacked enemies suffer from a lesser fire explosion and are thrown back.',
    descriptionEnUs1:
      'Attacked enemies suffer from a fire explosion and are thrown back.',
    descriptionEnUs2:
      'Attacked enemies suffer from a greater fire explosion and are thrown back.',
  },
  {
    id: 'spirit-explosion',
    categories: bows.concat(wands, scrolls),
    effectNameDe: 'Magieexplosion',
    effectNameEnUs: 'Magic Explosion',
    nameDe0: 'der kleinen Magieexplosion',
    nameDe1: 'der Magieexplosion',
    nameDe2: 'der großen Magieexplosion',
    nameEnUs0: 'of lesser Magic Explosion',
    nameEnUs1: 'of Magic Explosion',
    nameEnUs2: 'of greater Magic Explosion',
    descriptionDe0:
      'Getroffene Gegner erleiden durch eine kleine Magieexplosion schaden und werden zurückgeworfen.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch eine Magieexplosion schaden und werden zurückgeworfen.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch eine große Magieexplosion schaden und werden zurückgeworfen.',
    descriptionEnUs0:
      'Attacked enemies suffer from a lesser magic explosion and are thrown back.',
    descriptionEnUs1:
      'Attacked enemies suffer from a magic explosion and are thrown back.',
    descriptionEnUs2:
      'Attacked enemies suffer from a greater magic explosion and are thrown back.',
  },
  {
    id: 'fire-arrows',
    categories: bows.concat(wands, scrolls),
    effectNameDe: 'Feuerpfeile',
    effectNameEnUs: 'Fire Arrows',
    nameDe0: 'der kleinen Feuerpfeile',
    nameDe1: 'der Feuerpfeile',
    nameDe2: 'der großen Feuerpfeile',
    nameEnUs0: 'of lesser Fire Arrows',
    nameEnUs1: 'of Fire Arrows',
    nameEnUs2: 'of greater Fire Arrows',
    descriptionDe0: 'Gegner werden mit kleinen Feuerpfeilen beschossen.',
    descriptionDe1: 'Gegner werden mit Feuerpfeilen beschossen.',
    descriptionDe2: 'Gegner werden mit großen Feuerpfeilen beschossen.',
    descriptionEnUs0: 'Enemies are attacked by lesser fire arrows.',
    descriptionEnUs1: 'Enemies are attacked by fire arrows.',
    descriptionEnUs2: 'Enemies are attacked by greater fire arrows.',
  },
  {
    id: 'spirit-arrows',
    categories: bows.concat(wands, scrolls),
    effectNameDe: 'Magiepfeile',
    effectNameEnUs: 'Magic Arrows',
    nameDe0: 'der kleinen Magiepfeile',
    nameDe1: 'der Magiepfeile',
    nameDe2: 'der großen Magiepfeile',
    nameEnUs0: 'of lesser Magic Arrows',
    nameEnUs1: 'of Magic Arrows',
    nameEnUs2: 'of greater Magic Arrows',
    descriptionDe0: 'Gegner werden mit kleinen Magiepfeilen beschossen.',
    descriptionDe1: 'Gegner werden mit Magiepfeilen beschossen.',
    descriptionDe2: 'Gegner werden mit großen Magiepfeilen beschossen.',
    descriptionEnUs0: 'Enemies are attacked by lesser magic arrows.',
    descriptionEnUs1: 'Enemies are attacked by magic arrows.',
    descriptionEnUs2: 'Enemies are attacked by greater magic arrows.',
  },
  {
    id: 'acidball',
    categories: bows.concat(wands, scrolls),
    effectNameDe: 'Säureball',
    effectNameEnUs: 'Acidball',
    nameDe0: 'des kleinen Säureballs',
    nameDe1: 'des Säureballs',
    nameDe2: 'des großen Säureballs',
    nameEnUs0: 'of lesser Acidball',
    nameEnUs1: 'of Acidball',
    nameEnUs2: 'of greater Acidball',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Säureball schaden und werden zurückgeworfen.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch einen Säureball schaden und werden zurückgeworfen.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Säureball schaden und werden zurückgeworfen.',
    descriptionEnUs0:
      'Attacked enemies suffer from a lesser acidball and are thrown back.',
    descriptionEnUs1:
      'Attacked enemies suffer from an acidball and are thrown back.',
    descriptionEnUs2:
      'Attacked enemies suffer from a greater acidball and are thrown back.',
  },
  {
    id: 'fireball',
    categories: bows.concat(wands, scrolls),
    effectNameDe: 'Feuerball',
    effectNameEnUs: 'Fireball',
    nameDe0: 'des kleinen Feuerballs',
    nameDe1: 'des Feuerballs',
    nameDe2: 'des großen Feuerballs',
    nameEnUs0: 'of lesser Fireball',
    nameEnUs1: 'of Fireball',
    nameEnUs2: 'of greater Fireball',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Feuerball schaden und werden zurückgeworfen.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch einen Feuerball schaden und werden zurückgeworfen.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Feuerball schaden und werden zurückgeworfen.',
    descriptionEnUs0:
      'Attacked enemies suffer from a lesser fireball and are thrown back.',
    descriptionEnUs1:
      'Attacked enemies suffer from a fireball and are thrown back.',
    descriptionEnUs2:
      'Attacked enemies suffer from a greater fireball and are thrown back.',
  },
  {
    id: 'fog',
    categories: weapons.concat(wands, scrolls),
    effectNameDe: 'Nebel',
    effectNameEnUs: 'Fog',
    nameDe0: 'des kleinen Nebels',
    nameDe1: 'des Nebels',
    nameDe2: 'des großen Nebels',
    nameEnUs0: 'of lesser Fog',
    nameEnUs1: 'of Fog',
    nameEnUs2: 'of greater Fog',
    descriptionDe0:
      'Die Sicht von getroffenen Gegner wird durch einen kleinen Nebel beschränkt.',
    descriptionDe1:
      'Die Sicht von getroffenen Gegner wird durch einen Nebel beschränkt.',
    descriptionDe2:
      'Die Sicht von getroffenen Gegner wird durch einen großen Nebel beschränkt.',
    descriptionEnUs0:
      'The sight of attacked enemies is reduced by a lesser fog.',
    descriptionEnUs1: 'The sight of attacked enemies is reduced by a fog.',
    descriptionEnUs2:
      'The sight of attacked enemies is reduced by a greater fog.',
  },
  {
    id: 'haste',
    categories: armors.concat(scrolls, potions),
    effectNameDe: 'Eile',
    effectNameEnUs: 'Haste',
    nameDe0: 'der kleinen Eile',
    nameDe1: 'der Eile',
    nameDe2: 'der großen Eile',
    nameEnUs0: 'of lesser Haste',
    nameEnUs1: 'of Haste',
    nameEnUs2: 'of greater Haste',
    descriptionDe0:
      'Die Geschwindigkeit des Benutzers wird durch die kleine Eile erhöht.',
    descriptionDe1:
      'Die Geschwindigkeit des Benutzers wird durch die Eile erhöht.',
    descriptionDe2:
      'Die Geschwindigkeit des Benutzers wird durch die große Eile erhöht.',
    descriptionEnUs0: "Lesser haste increases the user's speed.",
    descriptionEnUs1: "Haste increases the user's speed.",
    descriptionEnUs2: "Greater haste increases the user's speed.",
  },
  {
    id: 'heal',
    categories: scrolls.concat(potions),
    effectNameDe: 'Heilung',
    effectNameEnUs: 'Healing',
    nameDe0: 'der kleinen Heilung',
    nameDe1: 'der Heilung',
    nameDe2: 'der großen Heilung',
    nameEnUs0: 'of lesser Healing',
    nameEnUs1: 'of Healing',
    nameEnUs2: 'of greater Healing',
    descriptionDe0: 'Der Benutzer erhält eine kleine Heilung.',
    descriptionDe1: 'Der Benutzer erhält eine Heilung.',
    descriptionDe2: 'Der Benutzer erhält eine großen Heilung.',
    descriptionEnUs0: 'The user is healed by a lesser cure.',
    descriptionEnUs1: 'The user is healed by a cure.',
    descriptionEnUs2: 'The user is healed by a greater cure.',
  },
  {
    id: 'horror',
    categories: weapons.concat(wands, scrolls),
    effectNameDe: 'Horror',
    effectNameEnUs: 'Horror',
    nameDe0: 'des kleinen Horrors',
    nameDe1: 'des Horrors',
    nameDe2: 'des großen Horrors',
    nameEnUs0: 'of lesser Horror',
    nameEnUs1: 'of Horror',
    nameEnUs2: 'of greater Horror',
    descriptionDe0:
      'Getroffene Gegner werden durch einen kleinen Horror heimgesucht und erleiden Schaden.',
    descriptionDe1:
      'Getroffene Gegner werden durch einen Horror heimgesucht und erleiden Schaden.',
    descriptionDe2:
      'Getroffene Gegner werden durch einen großen Horror heimgesucht und erleiden Schaden.',
    descriptionEnUs0:
      'Attacked enemies are haunted by a lesser horror and suffer damage.',
    descriptionEnUs1:
      'Attacked enemies are haunted by a horror and suffer damage.',
    descriptionEnUs2:
      'Attacked enemies are haunted by a greater horror and suffer damage.',
  },
  {
    id: 'ice-storm',
    categories: weapons.concat(bows, wands, scrolls),
    effectNameDe: 'Schneesturm',
    effectNameEnUs: 'Blizzard',
    nameDe0: 'des kleinen Schneesturms',
    nameDe1: 'des Schneesturms',
    nameDe2: 'des großen Schneesturms',
    nameEnUs0: 'of lesser Blizzard',
    nameEnUs1: 'of Blizzard',
    nameEnUs2: 'of greater Blizzard',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Schneesturm schaden.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch einen Schneesturm schaden.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Schneesturm schaden.',
    descriptionEnUs0: 'Attacked enemies suffer from a lesser blizzard.',
    descriptionEnUs1: 'Attacked enemies suffer from a blizzard.',
    descriptionEnUs2: 'Attacked enemies suffer from a greater blizzard.',
  },
  {
    id: 'spirit-of-nature',
    categories: armors.concat(scrolls, potions),
    effectNameDe: 'Naturkraft',
    effectNameEnUs: 'Nature Power',
    nameDe0: 'der kleinen Naturkraft',
    nameDe1: 'der Naturkraft',
    nameDe2: 'der großen Naturkraft',
    nameEnUs0: 'of lesser Nature Power',
    nameEnUs1: 'of Nature Power',
    nameEnUs2: 'of greater Nature Power',
    descriptionDe0: 'Der Benutzer wird durch eine kleine Naturkraft geschützt.',
    descriptionDe1: 'Der Benutzer wird durch eine Naturkraft geschützt.',
    descriptionDe2: 'Der Benutzer wird durch eine große Naturkraft geschützt.',
    descriptionEnUs0: 'The user is protected by a lesser nature power.',
    descriptionEnUs1: 'The user is protected by a nature power.',
    descriptionEnUs2: 'The user is protected by a greater nature power.',
  },
  {
    id: 'light',
    categories: armors.concat(scrolls),
    effectNameDe: 'Licht',
    effectNameEnUs: 'Light',
    nameDe0: 'des kleinen Lichts',
    nameDe1: 'des Lichts',
    nameDe2: 'des großen Lichts',
    nameEnUs0: 'of lesser Light',
    nameEnUs1: 'of Light',
    nameEnUs2: 'of greater Light',
    descriptionDe0: 'Die Umgebung wird durch ein kleines Licht erhellt.',
    descriptionDe1: 'Die Umgebung wird durch ein Licht erhellt.',
    descriptionDe2: 'Die Umgebung wird durch ein großes Licht erhellt.',
    descriptionEnUs0: 'The surroundings are illuminated by a lesser light.',
    descriptionEnUs1: 'The surroundings are illuminated by a light.',
    descriptionEnUs2: 'The surroundings are illuminated by a greater light.',
  },
  {
    id: 'lightning',
    categories: weapons.concat(bows, wands, scrolls),
    effectNameDe: 'Blitz',
    effectNameEnUs: 'Lightning',
    nameDe0: 'des kleinen Blitzes',
    nameDe1: 'des Blitzes',
    nameDe2: 'des großen Blitzes',
    nameEnUs0: 'of lesser Lightning',
    nameEnUs1: 'of Lightning',
    nameEnUs2: 'of greater Lightning',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Blitz schaden.',
    descriptionDe1: 'Getroffene Gegner erleiden durch einen Blitz schaden.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Blitz schaden.',
    descriptionEnUs0: 'Attacked enemies suffer from a lesser lightning.',
    descriptionEnUs1: 'Attacked enemies suffer from a lightning.',
    descriptionEnUs2: 'Attacked enemies suffer from a greater lightning.',
  },
  {
    id: 'acid-rain',
    categories: wands.concat(scrolls),
    effectNameDe: 'Säureregen',
    effectNameEnUs: 'Acid Rain',
    nameDe0: 'des kleinen Säureregens',
    nameDe1: 'des Säureregens',
    nameDe2: 'des großen Säureregens',
    nameEnUs0: 'of lesser Acid Rain',
    nameEnUs1: 'of Acid Rain',
    nameEnUs2: 'of greater Acid Rain',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Säureregen schaden.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch einen Säureregen schaden.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Säureregen schaden.',
    descriptionEnUs0: 'Attacked enemies suffer from a lesser acid rain.',
    descriptionEnUs1: 'Attacked enemies suffer from an acid rain.',
    descriptionEnUs2: 'Attacked enemies suffer from a greater acid rain.',
  },
  {
    id: 'ice-rain',
    categories: wands.concat(scrolls),
    effectNameDe: 'Eisregen',
    effectNameEnUs: 'Ice Rain',
    nameDe0: 'des kleinen Eisregens',
    nameDe1: 'des Eisregens',
    nameDe2: 'des großen Eisregens',
    nameEnUs0: 'of lesser Ice Rain',
    nameEnUs1: 'of Ice Rain',
    nameEnUs2: 'of greater Ice Rain',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Eisregen schaden.',
    descriptionDe1: 'Getroffene Gegner erleiden durch einen Eisregen schaden.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Eisregen schaden.',
    descriptionEnUs0: 'Attacked enemies suffer from a lesser ice rain.',
    descriptionEnUs1: 'Attacked enemies suffer from an ice rain.',
    descriptionEnUs2: 'Attacked enemies suffer from a greater ice rain.',
  },
  {
    id: 'acid-protection',
    categories: armors.concat(scrolls, potions),
    effectNameDe: 'Säureschutz',
    effectNameEnUs: 'Acid Protection',
    nameDe0: 'des kleinen Säureschutzes',
    nameDe1: 'des Säureschutzes',
    nameDe2: 'des großen Säureschutzes',
    nameEnUs0: 'of lesser Acid Protection',
    nameEnUs1: 'of Acid Protection',
    nameEnUs2: 'of greater Acid Protection',
    descriptionDe0: 'Der Benutzer erhält einen kleinen Säureschutz.',
    descriptionDe1: 'Der Benutzer erhält einen Säureschutz.',
    descriptionDe2: 'Der Benutzer erhält einen großen Säureschutz.',
    descriptionEnUs0: 'The user receives a lesser acid protection.',
    descriptionEnUs1: 'The user receives an acid protection.',
    descriptionEnUs2: 'The user receives a greater acid protection.',
  },
  {
    id: 'ice-protection',
    categories: armors.concat(scrolls, potions),
    effectNameDe: 'Eisschutz',
    effectNameEnUs: 'Ice Protection',
    nameDe0: 'des kleinen Eisschutzes',
    nameDe1: 'des Eisschutzes',
    nameDe2: 'des großen Eisschutzes',
    nameEnUs0: 'of lesser Ice Protection',
    nameEnUs1: 'of Ice Protection',
    nameEnUs2: 'of greater Ice Protection',
    descriptionDe0: 'Der Benutzer erhält einen kleinen Eisschutz.',
    descriptionDe1: 'Der Benutzer erhält einen Eisschutz.',
    descriptionDe2: 'Der Benutzer erhält einen großen Eisschutz.',
    descriptionEnUs0: 'The user receives a lesser ice protection.',
    descriptionEnUs1: 'The user receives an ice protection.',
    descriptionEnUs2: 'The user receives a greater ice protection.',
  },
  {
    id: 'fire-protection',
    categories: armors.concat(scrolls, potions),
    effectNameDe: 'Feuerschutz',
    effectNameEnUs: 'Fire Protection',
    nameDe0: 'des kleinen Feuerschutzes',
    nameDe1: 'des Feuerschutzes',
    nameDe2: 'des großen Feuerschutzes',
    nameEnUs0: 'of lesser Fire Protection',
    nameEnUs1: 'of Fire Protection',
    nameEnUs2: 'of greater Fire Protection',
    descriptionDe0: 'Der Benutzer erhält einen kleinen Feuerschutz.',
    descriptionDe1: 'Der Benutzer erhält einen Feuerschutz.',
    descriptionDe2: 'Der Benutzer erhält einen großen Feuerschutz.',
    descriptionEnUs0: 'The user receives a lesser fire protection.',
    descriptionEnUs1: 'The user receives a fire protection.',
    descriptionEnUs2: 'The user receives a greater fire protection.',
  },
  {
    id: 'spirit-protection',
    categories: armors.concat(scrolls, potions),
    effectNameDe: 'Magieschutz',
    effectNameEnUs: 'Magic Protection',
    nameDe0: 'des kleinen Magieschutzes',
    nameDe1: 'des Magieschutzes',
    nameDe2: 'des großen Magieschutzes',
    nameEnUs0: 'of lesser Magic Protection',
    nameEnUs1: 'of Magic Protection',
    nameEnUs2: 'of greater Magic Protection',
    descriptionDe0: 'Der Benutzer erhält einen kleinen Magieschutz.',
    descriptionDe1: 'Der Benutzer erhält einen Magieschutz.',
    descriptionDe2: 'Der Benutzer erhält einen großen Magieschutz.',
    descriptionEnUs0: 'The user receives a lesser magic protection.',
    descriptionEnUs1: 'The user receives a magic protection.',
    descriptionEnUs2: 'The user receives a greater magic protection.',
  },
  {
    id: 'rock',
    categories: wands.concat(scrolls),
    effectNameDe: 'Steinschlag',
    effectNameEnUs: 'Falling Rocks',
    nameDe0: 'des kleinen Steinschlags',
    nameDe1: 'des Steinschlags',
    nameDe2: 'des großen Steinschlags',
    nameEnUs0: 'of lesser Falling Rocks',
    nameEnUs1: 'of Falling Rocks',
    nameEnUs2: 'of greater Falling Rocks',
    descriptionDe0:
      'Getroffene Gegner erleiden durch einen kleinen Steinschlag schaden und werden zurückgeworfen.',
    descriptionDe1:
      'Getroffene Gegner erleiden durch einen Steinschlag schaden und werden zurückgeworfen.',
    descriptionDe2:
      'Getroffene Gegner erleiden durch einen großen Steinschlag schaden und werden zurückgeworfen.',
    descriptionEnUs0:
      'Attacked enemies suffer from lesser falling rocks and are thrown back.',
    descriptionEnUs1:
      'Attacked enemies suffer from falling rocks and are thrown back.',
    descriptionEnUs2:
      'Attacked enemies suffer from greater falling rocks and are thrown back.',
  },
  {
    id: 'rune-of-ice',
    categories: armors.concat(scrolls),
    effectNameDe: 'Eisrune',
    effectNameEnUs: 'Ice Rune',
    nameDe0: 'der kleinen Eisrune',
    nameDe1: 'der Eisrune',
    nameDe2: 'der großen Eisrune',
    nameEnUs0: 'of lesser Ice Rune',
    nameEnUs1: 'of Ice Rune',
    nameEnUs2: 'of greater Ice Rune',
    descriptionDe0: 'Die kleine Eisrune erzeugt eine Eisaura um den Benutzer.',
    descriptionDe1: 'Die Eisrune erzeugt eine Eisaura um den Benutzer.',
    descriptionDe2: 'Die große Eisrune erzeugt eine Eisaura um den Benutzer.',
    descriptionEnUs0:
      'The lesser ice rune creates an ice aura around the user.',
    descriptionEnUs1: 'The ice rune creates an ice aura around the user.',
    descriptionEnUs2:
      'The greater ice rune creates an ice aura around the user.',
  },
  {
    id: 'rune-of-fire',
    categories: armors.concat(scrolls),
    effectNameDe: 'Feuerrune',
    effectNameEnUs: 'Fire Rune',
    nameDe0: 'der kleinen Feuerrune',
    nameDe1: 'der Feuerrune',
    nameDe2: 'der großen Feuerrune',
    nameEnUs0: 'of lesser Fire Rune',
    nameEnUs1: 'of Fire Rune',
    nameEnUs2: 'of greater Fire Rune',
    descriptionDe0:
      'Die kleine Feuerrune erzeugt eine Feueraura um den Benutzer.',
    descriptionDe1: 'Die Feuerrune erzeugt eine Feueraura um den Benutzer.',
    descriptionDe2:
      'Die große Feuerrune erzeugt eine Feueraura um den Benutzer.',
    descriptionEnUs0:
      'The lesser fire rune creates a fire aura around the user.',
    descriptionEnUs1: 'The fire rune creates a fire aura around the user.',
    descriptionEnUs2:
      'The greater fire rune creates a fire aura around the user.',
  },
  {
    id: 'rune-of-spirit',
    categories: armors.concat(scrolls),
    effectNameDe: 'Magierune',
    effectNameEnUs: 'Magic Rune',
    nameDe0: 'der kleinen Magierune',
    nameDe1: 'der Magierune',
    nameDe2: 'der großen Magierune',
    nameEnUs0: 'of lesser Magic Rune',
    nameEnUs1: 'of Magic Rune',
    nameEnUs2: 'of greater Magic Rune',
    descriptionDe0:
      'Die kleine Magierune erzeugt eine Magieaura um den Benutzer.',
    descriptionDe1: 'Die Magierune erzeugt eine Magieaura um den Benutzer.',
    descriptionDe2:
      'Die große Magierune erzeugt eine Magieaura um den Benutzer.',
    descriptionEnUs0:
      'The lesser magic rune creates a magic aura around the user.',
    descriptionEnUs1: 'The magic rune creates a magic aura around the user.',
    descriptionEnUs2:
      'The greater magic rune creates a magic aura around the user.',
  },
  {
    id: 'entangle',
    categories: weapons.concat(bows, wands, scrolls),
    effectNameDe: 'Umschlingen',
    effectNameEnUs: 'Entangle',
    nameDe0: 'des kleinen Umschlingens',
    nameDe1: 'des Umschlingens',
    nameDe2: 'des großen Umschlingens',
    nameEnUs0: 'of lesser Entangle',
    nameEnUs1: 'of Entangle',
    nameEnUs2: 'of greater Entangle',
    descriptionDe0:
      'Getroffene Gegner werden durch ein kleines Umschlingen festgehalten und nehmen Schaden.',
    descriptionDe1:
      'Getroffene Gegner werden durch ein Umschlingen festgehalten und nehmen Schaden.',
    descriptionDe2:
      'Getroffene Gegner werden durch ein großes Umschlingen festgehalten und nehmen Schaden.',
    descriptionEnUs0:
      'Attacked enemies are held by a lesser entangle and receive damage.',
    descriptionEnUs1:
      'Attacked enemies are held by an entangle and receive damage.',
    descriptionEnUs2:
      'Attacked enemies are held by a greater entangle and receive damage.',
  },
  {
    id: 'whirlwind',
    categories: wands.concat(scrolls),
    effectNameDe: 'Wirbelsturm',
    effectNameEnUs: 'Whirlwind',
    nameDe0: 'des kleinen Wirbelsturms',
    nameDe1: 'des Wirbelsturms',
    nameDe2: 'des großen Wirbelsturms',
    nameEnUs0: 'of lesser Whirlwind',
    nameEnUs1: 'of Whirlwind',
    nameEnUs2: 'of greater Whirlwind',
    descriptionDe0:
      'Getroffene Gegner werden durch einen kleinen Wirbelsturm festgehalten und nehmen Schaden.',
    descriptionDe1:
      'Getroffene Gegner werden durch einen Wirbelsturm festgehalten und nehmen Schaden.',
    descriptionDe2:
      'Getroffene Gegner werden durch einen großen Wirbelsturm festgehalten und nehmen Schaden.',
    descriptionEnUs0:
      'Attacked enemies are held by a lesser whirlwind and receive damage.',
    descriptionEnUs1:
      'Attacked enemies are held by a whirlwind and receive damage.',
    descriptionEnUs2:
      'Attacked enemies are held by a greater whirlwind and receive damage.',
  },
];

export const categoryEffects: {
  [key: string]: Effect[];
} = {};

(Object.values(Category) as string[]).forEach((category: string) => {
  categoryEffects[category] = effects.filter((effect) =>
    effect.categories.includes(category as Category)
  );
});
