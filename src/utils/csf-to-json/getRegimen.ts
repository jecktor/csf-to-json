type RegimenesEntry = {
  regimen: string;
  fechaInicio: string;
  fechaFin: string;
};

export function getRegimen(csf: string) {
  const regimenesSection = csf
    .match(/Regímenes:\s+(.*?)\s+(Obligaciones|Sus\s+datos)/)![1]
    .split(/Fecha\s+Fin/)[1];

  const regex =
    /\s*([^0-9]+?)\s+(\d{2}\/\d{2}\/\d{4})(\s+\d{2}\/\d{2}\/\d{4})?\s*/g;

  const regimenes: RegimenesEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(regimenesSection)) !== null) {
    const [, regimen, fechaInicio, fechaFin] = match;

    regimenes.push({
      regimen: regimen.trim(),
      fechaInicio: fechaInicio.trim(),
      fechaFin: fechaFin ? fechaFin.trim() : "",
    });
  }

  return regimenes;
}
