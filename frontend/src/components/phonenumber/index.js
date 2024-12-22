import 'react-phone-input-2/lib/style.css'
import { useEffect, useState } from "react";
import PhoneInput from 'react-phone-input-2'
import { useForm } from 'react-hook-form';

const PhoneNumberInput = (props) => {
  const { onChange, value, name, disabled } = props;
  const [state, setState] = useState(value);
  const { register } = useForm();

  useEffect(() => {
    setState(value)
  }, [value]);

  return (
    <PhoneInput
      // onlyCountries={['us']}
      inputProps={{
        name: name
      }}
      {...register(`${name}`)}
      country={'us'}
      value={state}
      countryCodeEditable={true}
      onChange={(value, country, e, formattedValue) => {
        console.log("phone number", value, country, formattedValue)
        setState(formattedValue)
        onChange({ target: { name: props.name, value: formattedValue } })
      }}
      disabled={disabled}
      inputStyle={{
        color: '#181818',
        borderColor: '#e5e7eb',
        fontSize: '14px',
        height: '41px',
        width: '100%',
        fontFamily: 'gilroy',
      }}
    />
  )
}

export default PhoneNumberInput;