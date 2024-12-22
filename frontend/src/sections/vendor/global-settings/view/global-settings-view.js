import React from "react";
import { useForm, FormProvider } from "react-hook-form";
// Components
import GlobalSettings from '../global-settings';
import BusinessModelFees from '../business-model-fees';
import CourierDeliveryFees from '../courier-delivery-fees';

export default function GlobalSettingsView() {

  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-[48px]">
        <GlobalSettings />
        <CourierDeliveryFees />
        <BusinessModelFees />
      </div>
    </FormProvider>
  );
}