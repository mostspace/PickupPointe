import React, { useEffect, useState } from "react";
import { IMaskInput } from 'react-imask';
import { formatPhoneNumber, removeCountryCode } from "src/utils/format-phone-number";

const PhoneNumberMaskInput = React.forwardRef(function PhoneNumberMaskInput(props, ref) {
    const { onChange, ...other } = props;
    const [value, setValue] = useState("");

    useEffect(()=>{
      setValue(removeCountryCode(other.value))
    }, [other.value])
    return (
      <IMaskInput
        {...other}
        mask="(#00) 000-0000"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref}
        value={value}
        onAccept={(value) => {
          onChange({ target: { name: props.name, value: formatPhoneNumber(value) } })
          setValue(value);
        }}
        overwrite
      />
    );
});

export default PhoneNumberMaskInput;