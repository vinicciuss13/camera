import {View, Text, Stylesheet, TouchableOpacity, 
        PermissionsAndroid, Alert, ActivityIndicator} from 'react-native'; 

import {useState, useRef} from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {Assets, usePermissions} from 'expo-media-library';


export default function App() {
  return (
    <View style={styles.container}>
     
    </View>
  );
}

function TelaCamera (){
  const [PermissaoCamera, setPermissaoCamera] = useCameraPermissions();
  const [PermissaoGaleria, setPermissaoGaleria] = usePermissions({writeOnly: true});
  const [Salvando, setSalvando] = useState(false);
  const camera = useRef(null);

  if(!PermissaoCamera && !PermissaoGaleria){
    return null;
  }

  const TemPermissao = PermissaoCamera.granted && PermissaoGaleria.granted 
}
