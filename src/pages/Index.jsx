import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import { Box, Input, Button, VStack } from "@chakra-ui/react";
import Draggable from "react-draggable";
import "leaflet/dist/leaflet.css";

const LocationMarker = ({ position, name, onDrag }) => {
  return (
    <Draggable position={position} onStop={(e, data) => onDrag(data)}>
      <Box
        position="absolute"
        top={position.y}
        left={position.x}
        bg="white"
        p={2}
        borderRadius="md"
        boxShadow="md"
        cursor="move"
      >
        {name}
      </Box>
    </Draggable>
  );
};

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const Index = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState(null);
  const [locationName, setLocationName] = useState("");

  const handleMapClick = (latlng) => {
    setNewLocation(latlng);
  };

  const handleAddLocation = () => {
    setLocations([...locations, { ...newLocation, name: locationName, position: { x: 0, y: 0 } }]);
    setNewLocation(null);
    setLocationName("");
  };

  const handleDrag = (index, data) => {
    const updatedLocations = [...locations];
    updatedLocations[index].position = { x: data.x, y: data.y };
    setLocations(updatedLocations);
  };

  return (
    <Box height="100vh" width="100vw">
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onClick={handleMapClick} />
        {locations.map((loc, index) => (
          <LocationMarker
            key={index}
            position={loc.position}
            name={loc.name}
            onDrag={(data) => handleDrag(index, data)}
          />
        ))}
      </MapContainer>
      {newLocation && (
        <Box position="absolute" bottom={4} left="50%" transform="translateX(-50%)" bg="white" p={4} borderRadius="md" boxShadow="md">
          <VStack spacing={2}>
            <Input
              placeholder="Location Name"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
            <Button onClick={handleAddLocation}>Add Location</Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default Index;