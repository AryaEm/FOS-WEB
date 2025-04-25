import { storeCookie, getCookie } from "../../../lib/client-cookie"; // atau sesuai path utilitasmu
import { ICustomer } from "@/app/types";

export const saveCustomerToCookie = (customer: ICustomer) => {
  storeCookie("customerInfo", JSON.stringify(customer));
};

export const loadCustomerFromCookie = (): ICustomer => {
  const saved = getCookie("customerInfo");
  return saved
    ? JSON.parse(saved)
    : { customer: "", table_number: "", payment_method: "" };
};
