type GeneralData = {
  persona: string;
  razonSocial?: string;
  nombres?: string;
  primerApellido?: string;
  segundoApellido?: string;
  curp?: string;
  estatusEnElPadron: string;
  rfc: string;
  regimenCapital: string;
  abreviaturaRegimen: string;
  codigoPostal: string;
  nombreDeLaColonia: string;
  tipoDeVialidad: string;
  nombreDeVialidad: string;
  entreCalle: string;
  yCalle: string;
  numeroExterior: string;
  numeroInterior: string;
  nombreDeLaLocalidad: string;
  nombreDelMunicipioODemarcacionTerritorial: string;
  nombreDeLaEntidadFederativa: string;
  fechaInicioDeOperaciones: string;
  fechaDeUltimoCambioDeEstado: string;
};

function getNumberMonth(monthName: string): string {
  const months = {
    jan: "01",
    ene: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    abr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    ago: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
    dic: "12",
  };

  // @ts-expect-error we can index with a string
  return months[monthName.slice(0, 3).toLowerCase()] ?? "Invalid month name";
}

function association(name: string) {
  const map = {
    "ASOCIACION CIVIL": "AC",
    "EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA": "EIRL",
    "EMPRESAS DE NATURALEZA MERCANTIL": "ENR",
    "SOCIEDAD EN COMANDITA DE REGULACION Y FISCALIZACION DE RESPONSABILIDAD LIMITADA":
      "S DE RI DE RL",
    "SOCIEDAD DE RESPONSABILIDAD LIMITADA": "S DE RL",
    "SOCIEDAD DE RESPONSABILIDAD LIMITADA DE INTERES NACIONAL": "S DE RL DE NI",
    "SOCIEDAD DE RESPONSABILIDAD LIMITADA DE SOCIEDAD DE RESPONSABILIDAD LIMITADA":
      "S DE RL DE S DE RL",
    "SOCIEDAD DE RESPONSABILIDAD LIMITADA DE SOCIEDAD DE RESPONSABILIDAD LIMITADA DE CAPITAL VARIABLE":
      "S DE RL DE S DE RL DE CV",
    "SOCIEDAD DE RESPONSABILIDAD LIMITADA DE INTERES PUBLICO": "S DE RL MI",
    "SOCIEDAD ANONIMA": "SA",
    "SOCIEDAD ANONIMA DE CAPITAL VARIABLE SOCIEDAD OPERADORA DE FONDOS DE OBJETO MULTIPLE":
      "SA DE CVSOFOM",
    "SOCIEDAD ANONIMA DE CAPITAL VARIABLE": "SA DE CV",
    "SOCIEDAD ANONIMA DE REGULACION Y FISCALIZACION": "SA DE RI",
    "SOCIEDAD ANONIMA DE REGULACION Y FISCALIZACION DE CAPITAL VARIABLE":
      "SA DE RI DE CV",
    "SOCIEDAD ANONIMA DE RESPONSABILIDAD LIMITADA DE CAPITAL VARIABLE":
      "SA DE RL DE CV",
    "SOCIEDAD EN ACCIONES": "SAA",
    "SOCIEDAD ANONIMA DE ADMINISTRACION E INVERSION": "SAAI",
    "SOCIEDAD ANONIMA PROMOTORA DE INVERSION": "SAPI",
    "SOCIEDAD ANONIMA PROMOTORA DE INVERSION DE CAPITAL VARIABLE": "SAPI DE CV",
    "SOCIEDAD ANONIMA PROMOTORA DE INVERSION DE REGULACION Y FISCALIZACION":
      "SAPI DE RI",
    "SOCIEDAD ANONIMA PROMOTORA DE INVERSION BURSATIL DE CAPITAL VARIABLE":
      "SAPIB DE CV",
    "SOCIEDAD POR ACCIONES SIMPLIFICADA": "SAS",
    "SOCIEDAD POR ACCIONES SIMPLIFICADA DE CAPITAL VARIABLE": "SAS DE CV",
    "SOCIEDAD POR ACCIONES SIMPLIFICADA DE RESPONSABILIDAD LIMITADA":
      "SAS DE RL",
    "SOCIEDAD CIVIL": "SC",
    "SOCIEDAD EN COMANDITA DE CAPITAL VARIABLE": "SC DE CV",
    "SOCIEDAD EN COMANDITA DE REGULACION Y FISCALIZACION": "SC DE RI",
    "SOCIEDAD EN COMANDITA DE REGULACION Y FISCALIZACION DE CAPITAL VARIABLE":
      "SC DE RI DE CV",
    "SOCIEDAD EN COMANDITA DE RESPONSABILIDAD LIMITADA": "SC DE RL",
    "SOCIEDAD EN COMANDITA DE PARTICIPACION": "SC DE RP",
    "SOCIEDAD EN COMANDITA DE PARTICIPACION DE CAPITAL VARIABLE":
      "SC DE RP DE CV",
    "SOCIEDAD EN COMANDITA POR ACCIONES": "SCA",
    "SOCIEDAD COOPERATIVA DE RESPONSABILIDAD LIMITADA": "SCRS",
    "SOCIEDAD EN NOMBRE COLECTIVO": "SNC",
    "SOCIEDAD EN NOMBRE COLECTIVO DE CAPITAL VARIABLE": "SNC DE CV",
    "SOCIEDAD FINANCIERA POPULAR": "SOFIPO",
    "SOCIEDAD DE RESPONSABILIDAD LIMITADA DE CAPITAL VARIABLE": "S DE RL DE CV",
    "SOCIEDAD DE PRODUCCION RURAL DE RESPONSABILIDAD LIMITADA DE CAPITAL":
      "SPR DE RL DE CV",
    "SOCIEDAD DE PRODUCCION RURAL DE RESPONSABILIDAD LIMITADA DE CAPITAL VARIABLE":
      "SPR DE RL DE CV",
  };

  // @ts-expect-error we can index with a string
  return map[name.toUpperCase()] ?? "";
}

export function getGeneralData(csf: string) {
  const generalData = {} as GeneralData;

  const company = csf.match(
    /Denominación\/Razón\s+Social:\s+(.*?)\s+Régimen/,
  )?.[1];

  if (company) {
    generalData.persona = "MORAL";

    generalData.razonSocial = company;
  } else {
    const name = csf.match(/Nombre\s+\(s\):\s+(.*?)\s+Primer/)?.[1];

    if (!name) throw new Error("CSF no válida");

    generalData.persona = "FÍSICA";

    generalData.nombres = name;

    generalData.primerApellido = csf.match(
      /Primer\s+Apellido:\s+(.*?)\s+Segundo/,
    )![1];

    generalData.segundoApellido = csf.match(
      /Segundo\s+Apellido:\s+(.*?)\s+Fecha/,
    )![1];

    generalData.curp = csf.match(/CURP:\s+(.*?)\s+Nombre/)![1];
  }

  generalData.estatusEnElPadron = csf.match(
    /Estatus\s+en\s+el\s+padrón:\s+(.*?)\s+Fecha/,
  )![1]!;

  generalData.rfc = csf.match(/RFC:\s+(.*?)\s+(Denominación|CURP)/)![1]!;

  generalData.regimenCapital =
    csf.match(/Régimen\s+Capital:\s+(.*?)\s+Nombre/)?.[1] ?? "";

  generalData.abreviaturaRegimen = association(generalData.regimenCapital);

  generalData.codigoPostal = csf.match(/Código\s+Postal:\s+(.*?)\s+Tipo/)![1]!;

  generalData.nombreDeLaColonia = csf.match(
    /Nombre\s+de\s+la\s+Colonia:\s+(.*?)\s+Nombre/,
  )![1]!;

  generalData.tipoDeVialidad = csf.match(
    /Tipo\s+de\s+Vialidad:\s+(.*?)\s+Nombre/,
  )![1]!;

  generalData.nombreDeVialidad = csf.match(
    /Nombre\s+de\s+Vialidad:\s+(.*?)\s+Número/,
  )![1]!;

  generalData.entreCalle = csf.match(/Entre\s+Calle:\s+(.*?)\s+Y\s+Calle/)![1]!;

  generalData.yCalle = csf.match(
    /Y\s+Calle:\s+(.*?)\s+(Actividades|Regímenes|Correo)/,
  )![1]!;

  generalData.numeroExterior = csf.match(
    /Número\s+Exterior:\s+(.*?)\s+Número/,
  )![1]!;

  generalData.numeroInterior = csf.match(
    /Número\s+Interior:\s+(.*?)\s+Nombre\s+de\s+la\s+Colonia/,
  )![1]!;

  generalData.nombreDeLaLocalidad =
    csf.match(
      /Nombre\s+de\s+la\s+Localidad:\s+(.*?)\s+Nombre\s+del\s+Municipio/,
    )?.[1] ?? "";

  generalData.nombreDelMunicipioODemarcacionTerritorial = csf.match(
    /Nombre\s+del\s+Municipio\s+o\s+Demarcación\s+Territorial:\s+(.*?)\s+Nombre/,
  )![1]!;

  generalData.nombreDeLaEntidadFederativa = csf.match(
    /Nombre\s+de\s+la\s+Entidad\s+Federativa:\s+(.*?)\s+Entre/,
  )![1]!;

  const startDate = csf
    .match(/Fecha\s+inicio\s+de\s+operaciones:\s+(.*?)\s+Estatus/)![1]
    .split(" ");

  const endDate = csf
    .match(
      /Fecha\s+de\s+último\s+cambio\s+de\s+estado:\s+(.*?)\s+(Nombre|Datos)/,
    )![1]
    .split(" ");

  const initialOperation = `${startDate[0]}/${getNumberMonth(startDate[2])}/${startDate[4]}`;
  const lastChangeOperations = `${endDate[0]}/${getNumberMonth(endDate[2])}/${endDate[4]}`;

  generalData.fechaInicioDeOperaciones = initialOperation;
  generalData.fechaDeUltimoCambioDeEstado = lastChangeOperations;

  return generalData;
}
