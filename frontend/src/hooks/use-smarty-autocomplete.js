import { useState, useCallback } from "react";
import { debounce } from "lodash";
import SmartySDK from "smartystreets-javascript-sdk";
import { SMARTY_EMBEDDED_KEY } from "src/config-global";

const useSmartyAutocomplete = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  const SmartyCore = SmartySDK.core;
  const Lookup = SmartySDK.usAutocompletePro.Lookup;

  const credentials = new SmartyCore.SharedCredentials(SMARTY_EMBEDDED_KEY);
  const clientBuilder = new SmartyCore.ClientBuilder(credentials).withLicenses([
    "us-autocomplete-pro-cloud",
  ]);
  const client = clientBuilder.buildUsAutocompleteProClient();

  const handleRequest = async (lookup) => {
    try {
      const results = await client.send(lookup);

      if (results.result && results.result.length > 0) {
        const transformedSuggestions = results.result.map(
          (suggestion, index) => ({
            label: `${suggestion.streetLine}, ${suggestion.city}, ${suggestion.state} ${suggestion.zipcode}`,
            value: `${suggestion.streetLine}, ${suggestion.city}, ${suggestion.state} ${suggestion.zipcode}`,
            key: `${index}-${suggestion.streetLine}-${suggestion.zipcode}`,
          })
        );
        setSuggestions(transformedSuggestions);
        setError("");
      } else {
        setSuggestions([]);
        setError("No street found");
      }
    } catch (err) {
      if (err.payload && err.payload.errors) {
        err.payload.errors.forEach((error) => {
          setError(`Error ${error.id}: ${error.message}`);
        });
      }
      setSuggestions([]);
    }
  };

  const debouncedHandleInputChange = useCallback(
    debounce(async (value) => {
      if (value) {
        let lookup = new Lookup();
        lookup.search = value;
        await handleRequest(lookup);
      } else {
        setSuggestions([]);
        setError("");
      }
    }, 500),
    [] 
  );

  return {
    suggestions,
    error,
    handleInputChange: debouncedHandleInputChange,
  };
};

export default useSmartyAutocomplete;
