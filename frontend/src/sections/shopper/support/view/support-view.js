import React from 'react';
import { useForm, FormProvider } from "react-hook-form"
import Main from '../main';

const ShopperSupportView = () => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
        <Main />
      </form>
    </FormProvider>
  );
};

export default ShopperSupportView;
