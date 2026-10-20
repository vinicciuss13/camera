import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, Linking, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
//import { Asset } from 'expo-media-library'; //iOS ou build
import { saveToLibraryAsync, usePermissions } from 'expo-media-library/legacy'; //Android com Expo Go
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <CameraScreen />
    </SafeAreaProvider>
  );
}

function CameraScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = usePermissions({ writeOnly: true });
  const [salvando, setSalvando] = useState(false);
  const camera = useRef(null);

  // ainda carregando o status das permissões
  if (!cameraPermission || !mediaPermission) return null;

  const temPermissao = cameraPermission.granted && mediaPermission.granted;

  const pedirPermissoes = async () => {
    const bloqueada =
      (!cameraPermission.granted && !cameraPermission.canAskAgain) ||
      (!mediaPermission.granted && !mediaPermission.canAskAgain);

    if (bloqueada) {
      Linking.openSettings();
      return;
    }

    const cam = await requestCameraPermission();
    if (cam.granted) await requestMediaPermission();
  };

  const tirarFoto = async () => {
    if (!camera.current || salvando) return;

    setSalvando(true);
    try {
      const foto = await camera.current.takePictureAsync({ quality: 0.8 });
      //await Asset.create(foto.uri); //iOS ou Build
      await saveToLibraryAsync(foto.uri); //Android no Expo Go
      Alert.alert('Sucesso', 'Foto salva na galeria!');
    } catch (erro) {
      console.log(erro);
      Alert.alert('Erro', 'Não foi possível salvar a foto.');
    } finally {
      setSalvando(false);
    }
  };

  if (!temPermissao) {
    return (
      <SafeAreaView style={styles.centro}>
        <Text style={styles.mensagem}>
          Precisamos da sua permissão para usar a câmera e a galeria
        </Text>
        <TouchableOpacity style={styles.botao} onPress={pedirPermissoes}>
          <Text style={styles.textoBotao}>Conceder permissões</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <CameraView ref={camera} style={styles.camera} facing="back" />

      <View style={styles.barraInferior}>
        <TouchableOpacity
          style={[styles.botao, salvando && styles.botaoDesativado]}
          onPress={tirarFoto}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>Tirar Foto</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  barraInferior: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  mensagem: { textAlign: 'center', marginBottom: 12, fontSize: 16 },
  botao: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  botaoDesativado: { opacity: 0.6 },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
});
