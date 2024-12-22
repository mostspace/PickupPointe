import PropTypes from 'prop-types';
import { useState, useCallback, memo } from 'react';
import Map, {Marker} from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import RoomIcon from "@mui/icons-material/Room";
// components
import { MapControl } from 'src/components/map';
//
import ControlPanel from './control-panel';
import { MAPBOX_API } from 'src/config-global'; // Assuming you have a config file for environment variables

// ----------------------------------------------------------------------

function PickupMap({latitude, longitude, themes, ...other }) {
  const [selectTheme, setSelectTheme] = useState('streets');

  const handleChangeTheme = useCallback((value) => setSelectTheme(value), []);

  const mapLatitude = latitude || 36.3302;
  const mapLongitude = longitude || -119.2921; 

  return (
    <>
      <Map
        initialViewState={{
          latitude: mapLatitude,  // Chicago latitude
          longitude: mapLongitude, // Chicago longitude
          zoom: 10, // Adjust the zoom level as needed
          bearing: 0,
          pitch: 0,
        }}
        mapStyle={themes?.[selectTheme]}
        latitude={mapLatitude}
        longitude={mapLongitude}
        {...other}
      >
        <Marker latitude={mapLatitude} longitude={mapLongitude}>
          <RoomIcon className={"bouncing-icon"} style={{ fontSize: 25, color: "red" }} />
        </Marker>
        {/* <MapControl /> */}
      </Map>

      {/* <ControlPanel themes={themes} selectTheme={selectTheme} onChangeTheme={handleChangeTheme} /> */}
    </>
  );
}

PickupMap.propTypes = {
  themes: PropTypes.object,
};

export default memo(PickupMap);
