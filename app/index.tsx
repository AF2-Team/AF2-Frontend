import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

const FrameContainer = styled(LinearGradient).attrs({
  colors: [
    "rgba(255, 255, 255, 1)",
    "rgba(188, 161, 189, 1)",
    "rgba(102, 81, 108, 1)",
    "rgba(66, 54, 70, 1)",
    "rgba(0, 0, 0, 1)",
  ],
  locations: [0, 0.25, 0.5, 0.75, 1],
})`
  border-radius: 50px;
  height: 917px;
  width: 412px;
  position: relative;
  overflow: hidden;
`;

const TusGustosTus = styled(Image)`
  height: 143px;
  left: 125px;
  position: absolute;
  top: 378px;
  width: 156px;
`;

const YaEresMiembroTexto = styled(Text)`
  color: #fff;
  font-family: "Open Sans";
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  left: 134px;
  position: absolute;
  top: 737px;
  width: 131px;
  text-align: center;
`;

const IniciaSesiN = styled(Text)`
  color: #FFF;
  font-family: "Open Sans";
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  text-decoration-line: underline;
  position: absolute;
  top: 769px;
  left: 159px;
`;

const BotonRegistro = styled(TouchableOpacity)`
  height: 50px;
  left: 47px;
  position: absolute;
  top: 636px;
  width: 321px;
`;

const OverlapGroup = styled(View)`
  background-color: #8a2be2; /* var(--accentaccent-500) */
  border-radius: 30px;
  height: 50px;
  width: 319px;
  justify-content: center;
  align-items: center;
`;

const RegStrateConTu = styled(Image)`
  height: 14px;
  width: 213px;
`;

const Group = styled(View)`
  height: 212px;
  left: 33px;
  position: absolute;
  top: 116px;
  width: 332px;
`;

const Overlap = styled(View)`
  height: 212px;
  width: 329px;
  position: relative;
`;

const AFunSiteForYou = styled(Image)`
  height: 29px;
  left: 113px;
  position: absolute;
  top: 135px;
  width: 216px;
`;

const Element = styled(Image)`
  aspect-ratio: 0.75;
  height: 212px;
  left: 0;
  position: absolute;
  top: 0;
  width: 160px;
`;



export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <FrameContainer>
      <TusGustosTus
        source={require("@/assets/images/tus-gustos-tus-reglas-tu-espacio.png")}
      />
      <YaEresMiembroTexto>Ya eres miembro?</YaEresMiembroTexto>
      <IniciaSesiN> Inicia sesion</IniciaSesiN>
      <BotonRegistro onPress={() => router.push("../screens/register")}>
        <OverlapGroup>
          <RegStrateConTu
            source={require("@/assets/images/reg-strate-con-tu-correo.png")}
          />
        </OverlapGroup>
      </BotonRegistro>
      <Group>
        <Overlap>
          <AFunSiteForYou
            source={require("@/assets/images/a-fun-site-for-you.png")}
          />
          <Element source={require("@/assets/images/10-1.png")} />
        </Overlap>
      </Group>
  
    </FrameContainer>
  );
}
