export interface AppSpace {
  name: string;
  identifier: string;
}

export interface Service {
  identifier: string;
  name: string;
  title: string;
  icon: string;
  app_space: AppSpace;
  internal_only: boolean;
}

export interface Reseller {
  identifier: string;
  name: string;
}

export interface UsageQuotas {
  used_service_quota: number;
  used_resource_type_quota: number;
  used_resource_quota: number;
  used_user_quota: number;
  used_subscription_quota: number;
}

export interface Type {
  id: string;
  name: string;
  value: string;
}

export interface Theme {
  black: string;
  white: string;
  themeDark: string;
  themeLight: string;
  neutralDark: string;
  themeDarker: string;
  neutralLight: string;
  themeDarkAlt: string;
  themeLighter: string;
  themePrimary: string;
  themeTertiary: string;
  neutralLighter: string;
  neutralPrimary: string;
  themeSecondary: string;
  neutralTertiary: string;
  themeLighterAlt: string;
  neutralSecondary: string;
  neutralLighterAlt: string;
  neutralPrimaryAlt: string;
  neutralQuaternary: string;
  neutralTertiaryAlt: string;
  neutralQuaternaryAlt: string;
}

export interface ICustomer {
  identifier: string;
  is_target_host: boolean;
  services: Service[];
  logo_path: string;
  reseller: Reseller;
  usage_quotas: UsageQuotas;
  type: Type;
  name: string;
  alt_name: string;
  active: boolean;
  display_name: string;
  domain_name: string;
  app_id?: any;
  app_secret?: any;
  customer_number: string;
  adress: string;
  zip: string;
  stadt: string;
  country: string;
  phone: string;
  mobile: string;
  seller: string;
  uid: string;
  bic: string;
  iban: string;
  bank: string;
  fb_number: string;
  email: string;
  theme: Theme;
  showLogo: boolean;
  logo_base64: string;
  hide_name: boolean;
  theme_style: string;
  reseller_identifier: string;
  can_create_reseller: boolean;
  max_service_quota: number;
  max_resource_type_quota: number;
  max_resource_quota: number;
  max_subscription_quota: number;
  max_user_quota: number;
}
