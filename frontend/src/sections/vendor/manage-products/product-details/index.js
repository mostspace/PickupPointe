import React, { useEffect, useMemo, useState,  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// @mui
import {
  Button,
} from '@mui/material';

import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Components
import DefaultButton from "src/components/button/default-button";
import ButtonLoader from 'src/components/button-loader/ButtonLoader';
import ItemDetails from './item-details';
// import SpecialTimedPromotions from './special-timed-promotions';
import SpecialTimedPromotions from "../special-time-promotions";
import Modifiers from './modifiers';
import InclusionsItem from './inclusions-item';
import ImportantNotes from './important-notes';
import LocationsItem from "./locations-item";

// Hook
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'src/routes/hooks';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Reducers
import { getItem, selectItem, updateItem } from "src/reducers/itemSlice";
import { getAllLocations } from "src/reducers/locationSlice";

// --------------------------------------------------------------------------------------------------

const ProductDetails = () => {
  const router = useRouter();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const item = useSelector(state => selectItem(state, itemId));
  const { locations } = useSelector((state) => state.locations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getItem(itemId));
  }, [dispatch, itemId]);

  // RHF Hook Form
  const NewFormDataSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    itemId: Yup.string().required("Item id is required"),
    defaultPrice: Yup.number().moreThan(0, "Default price should not be 0"),
    categories: Yup.array().required("At least one category is required"),
    // taxRate: Yup.number().moreThan(0, "Tax Rate should not be 0"),
    perMetric: Yup.string().required("Per metric is required"),
    description: Yup.string().required("Description is required"),

    // variants: Yup.string().required(),
    // // nutritionalInformation: Yup.string().required("Nutritional Information is required"),
    // isInStock: Yup.boolean(),
    // sourceItemSales: Yup.array().required(),
    // attributes: Yup.object().required(),
    // timePromotion: Yup.object().required(),
    // modifiers: Yup.object().required(),
    // inclusions: Yup.object().required(),
    // locations: Yup.object().required(),
    // importantNotes: Yup.object().required(),
    // photo: Yup.mixed(),
  });

  const defaultValues = useMemo(() => {
    const {
      name,
      itemId,
      defaultPrice,
      categories,
      perMetric,
      variants,
      description,
      nutritionalInformation,
      isInStock,
      sourceItemSales,
      attributes,
      timePromotions,
      isUseTimePromotion,
      modifiers,
      inclusions,
      locations,
      importantNotes,
      photo,
      isFeatured
    } = item || {};

    return {
      name: name || "",
      itemId: itemId || "",
      defaultPrice: defaultPrice || "",  // Default to empty if not provided
      categories: categories || [],
      perMetric: perMetric || "",
      variants: variants || "",
      description: description || "",
      nutritionalInformation: nutritionalInformation || "",
      isInStock: isInStock || true,
      sourceItemSales: sourceItemSales || [],
      attributes: attributes || {},
      timePromotions: timePromotions || [],
      isUseTimePromotion: isUseTimePromotion || false,
      modifiers: modifiers || [],
      inclusions: inclusions || {},
      locations: locations || [],
      importantNotes: importantNotes || {},
      photo: photo || null,  // Null for file type
      featured_item: isFeatured || false
    };
  }, [item]);

  const methods = useForm({
    resolver: yupResolver(NewFormDataSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    formState: {errors},
    watch,
    handleSubmit,
  } = methods;

  useEffect(() => {
    if (item) {
      reset(item);
      const newLocations = item.locations.map((elem) => {
        const locationAPI = locations.find((value) => elem.locationId._id === value._id);
        return {
          ...locationAPI,
          ...elem,
          location: elem.locationId,
          locationId: elem.locationId._id
        }
      })
      setValue("locations", newLocations);
      setValue("featured_item", item.isFeatured);
      setValue("variants", item.variants);
      setValue("importantNotes", item.importantNotes);
      setValue("inclusions", item.inclusions);
    }
  }, [item, locations]);

  const onSubmit = async (event) => {
    // event.preventDefault();

    let formData = watch();
    formData.locations = formData.locations.map((item) => {
      return {location, ...item}
    });
    const data = new FormData();

    data.append("name", formData.name)
    data.append("itemId", formData.itemId)
    data.append("defaultPrice", formData.defaultPrice)
    data.append("categories", JSON.stringify(formData.categories));
    data.append("perMetric", formData.perMetric)
    data.append("variants", JSON.stringify(formData.variants))
    data.append("description", formData.description)
    data.append("nutritionalInformation", formData.nutritionalInformation)
    data.append("isInStock", formData.isInStock)
    data.append("attributes", JSON.stringify(formData.attributes))
    data.append("sourceItemSales", JSON.stringify(formData.sourceItemSales))
    data.append("isUseTimePromotion", formData.isUseTimePromotion)
    data.append("timePromotions", JSON.stringify(formData.isUseTimePromotion ? formData.timePromotions : []))
    data.append("modifiers", JSON.stringify(formData.modifiers))
    data.append("locations", JSON.stringify(formData.locations))
    data.append("inclusions", JSON.stringify(formData.inclusions))
    data.append("importantNotes", JSON.stringify(formData.importantNotes))
    data.append("photoStatus", formData.photoStatus)
    data.append("photo", formData.photo)
    data.append("isFeatured", formData.featured_item)

    for (let i = 0; i < Array.from(data.entries()).length; i++) {
      const [key, value] = Array.from(data.entries())[i];
    }
    setLoading(true);

    try {
      await dispatch(updateItem({ id: itemId, data }));
      toast("Changes Saved", {
        type: 'success',
        className: 'toast-custom',
      })
      router.push('/vendor/manage-products');
    } catch (error) {
      const msg = error?.message ? `, ${error.message}` : ''
      toast("Failed" + msg, {
        type: 'error',
        className: 'toast-custom',
      })
    } 
    setLoading(false);
  };

  if(!item) return <></>

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-[48px]">
            <ItemDetails errors={errors} />
            <SpecialTimedPromotions data={item.timePromotions} />
            <Modifiers onChangeModifiers={(modifierIDs) => {
              setValue('modifiers', modifierIDs)
            }} />
            <InclusionsItem />
            <LocationsItem />
            <ImportantNotes />

            <div className="flex justify-end items-center gap-[8px] mt-[8px]">
              <DefaultButton value="Back" className="bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" onClick={() => navigate('/vendor/manage-products')} />
              {
                loading ? <Button
                  className="w-48"
                  sx={{
                    padding: '8px 40px',
                    height: '44px',
                    fontFamily: 'Gilroy',
                    fontSize: '14px',
                    color: '#181818',
                    borderRadius: '8px',
                    border: "1px solid red",
                    backgroundColor: "transparent",
                  }}
                  disabled={loading}
                >
                  <ButtonLoader />
                </Button> :
                <DefaultButton type="submit" value={'Save changes'} />
              }
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

ProductDetails.propTypes = {
  formData: PropTypes.object,
};

export default ProductDetails;