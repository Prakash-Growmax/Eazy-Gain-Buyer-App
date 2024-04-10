import res from "../src/messages/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: typeof res;
  }
}
