import React from "react";
import { TouchableOpacity } from "react-native";
import { styled } from "styled-components";



const FrameContainer = styled.div`
  background-color: #ffffff;
  border-radius: 50px;
  height: 917px;
  position: relative;
  width: 428px;
`;

const Group = styled.div`
  height: 48px;
  left: 33px;
  position: absolute;
  top: 767px;
  width: 365px;
`;

const YaEresMiembro = styled.text`
  height: 14px;
  left: 115px;
  position: absolute;
  top: 6px;
  width: 131px;
`;

const IniciaSesiNAhora = styled.text`
  height: 16px;
  left: 110px;
  position: absolute;
  top: 33px;
  width: 140px;
`;

const Btn = styled.div`
  height: 50px;
  left: 24px;
  position: absolute;
  top: 687px;
  width: 382px;
`;

const OverlapGroup = styled.div`
  background-color: var(--accentaccent-500);
  border-radius: 50px;
  height: 50px;
  position: relative;
  width: 380px;
`;

const CrearCuenta = styled.img`
  height: 13px;
  left: 120px;
  position: absolute;
  top: 19px;
  width: 134px;
`;

const Div = styled.div`
  height: 24px;
  left: 33px;
  position: absolute;
  top: 633px;
  width: 363px;
`;

const LaContraseaDebe = styled.img`
  height: 11px;
  left: 35px;
  position: absolute;
  top: 6px;
  width: 311px;
`;

const Group2 = styled.div`
  height: 326px;
  left: 24px;
  position: absolute;
  top: 297px;
  width: 380px;
`;

const Group3 = styled.div`
  height: 74px;
  left: 0;
  position: absolute;
  top: 252px;
  width: 384px;
`;

const ImgWrapper = styled.div`
  background-image: url(./rectangle-1.svg);
  background-size: 100% 100%;
  height: 50px;
  left: 0;
  position: absolute;
  top: 24px;
  width: 380px;
`;

const Img = styled.img`
  height: 7px;
  left: 18px;
  position: absolute;
  top: 20px;
  width: 147px;
`;

const ConfirmarContrasea = styled.img`
  height: 11px;
  left: 18px;
  position: absolute;
  top: 4px;
  width: 154px;
`;

const Group4 = styled.div`
  height: 74px;
  left: 0;
  position: absolute;
  top: 168px;
  width: 384px;
`;

const Overlap = styled.div`
  background-image: url(./image.svg);
  background-size: 100% 100%;
  height: 50px;
  left: 0;
  position: absolute;
  top: 24px;
  width: 380px;
`;

const Contrasea = styled.img`
  height: 11px;
  left: 18px;
  position: absolute;
  top: 4px;
  width: 79px;
`;

const Group5 = styled.div`
  height: 74px;
  left: 0;
  position: absolute;
  top: 84px;
  width: 384px;
`;

const ElementUclaWrapper = styled.div`
  background-image: url(./rectangle-1-2.svg);
  background-size: 100% 100%;
  height: 50px;
  left: 0;
  position: absolute;
  top: 24px;
  width: 380px;
`;

const ElementUcla = styled.img`
  height: 15px;
  left: 18px;
  position: absolute;
  top: 20px;
  width: 222px;
`;

const DireccinDeCorreo = styled.img`
  height: 11px;
  left: 18px;
  position: absolute;
  top: 4px;
  width: 136px;
`;

const Group6 = styled.div`
  height: 74px;
  left: 0;
  position: absolute;
  top: 0;
  width: 384px;
`;

const AlirioFreytezWrapper = styled.div`
  background-image: url(./rectangle-1-3.svg);
  background-size: 100% 100%;
  height: 50px;
  left: 0;
  position: absolute;
  top: 24px;
  width: 380px;
`;

const AlirioFreytez = styled.img`
  height: 15px;
  left: 17px;
  position: absolute;
  top: 19px;
  width: 90px;
`;

const NombreYApellido = styled.img`
  height: 14px;
  left: 18px;
  position: absolute;
  top: 4px;
  width: 128px;
`;

const CrearUnaCuenta = styled.img`
  height: 23px;
  left: 102px;
  position: absolute;
  top: 221px;
  width: 223px;
`;

const Logotipo = styled.div`
  height: 108px;
  left: 62px;
  position: absolute;
  top: 59px;
  width: 306px;
`;

const Overlap2 = styled.div`
  height: 108px;
  position: relative;
  width: 300px;
`;

const AFunSiteForYou = styled.img`
  height: 33px;
  left: 80px;
  position: absolute;
  top: 74px;
  width: 220px;
`;

const Div2 = styled.div`
  background-image: url(./9-9.png);
  background-position: 50% 50%;
  background-size: cover;
  height: 108px;
  left: 0;
  position: absolute;
  top: 0;
  width: 92px;
`;
const buttonRegister = styled(TouchableOpacity)`
  height: 50px;
  width: 380px;
  background-color: ${({ theme }) => theme.colors.accent500 || '#6200EE'};
  border-radius: 50px;
  justify-content: center;
  align-items: center`; 

export const Frame =  (): JSX.Element => {
  return (
    <FrameContainer>
      <Group>
        <YaEresMiembro alt="Ya eres miembro" src={yaEresMiembro} />
        <IniciaSesiNAhora alt="Inicia sesin ahora" src={iniciaSesiNAhora} />
      </Group>

      <Btn>
        <OverlapGroup>
          <CrearCuenta alt="Crear cuenta" src={crearCuenta} />
        </OverlapGroup>
      </Btn>

      <Div>
        <LaContraseaDebe
          alt="La contrasea debe"
          src={laContraseADebeTenerAlMenos6Caracteres}
        />
        <Error className="error-instance" />
      </Div>

      <Group2>
        <Group3>
          <ImgWrapper>
            <Img alt="Img" src={image} />
          </ImgWrapper>
          <ConfirmarContrasea
            alt="Confirmar contrasea"
            src={confirmarContraseA}
          />
        </Group3>

        <Group4>
          <Overlap>
            <Img alt="Img" src={image2} />
          </Overlap>
          <Contrasea alt="Contrasea" src={contraseA} />
        </Group4>

        <Group5>
          <ElementUclaWrapper>
            <ElementUcla alt="Element ucla" src={Ucla} />
          </ElementUclaWrapper>
          <DireccinDeCorreo alt="Direccin de correo" src={direcciNDeCorreo} />
        </Group5>

        <Group6>
          <AlirioFreytezWrapper>
            <AlirioFreytez alt="Alirio freytez" src={alirioFreytez} />
          </AlirioFreytezWrapper>
          <NombreYApellido alt="Nombre y apellido" src={nombreYApellido} />
        </Group6>
      </Group2>

      <buttonRegister> Crear una cuenta </buttonRegister>

      <Logotipo>
        <Overlap2>
          <AFunSiteForYou alt="A fun site for you" src={aFunSiteForYou} />
          <Div2 />
        </Overlap2>
      </Logotipo>
    </FrameContainer>
  );
};
