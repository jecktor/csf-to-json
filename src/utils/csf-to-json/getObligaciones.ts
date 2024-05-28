type ObligacionesEntry = {
  descripcionDeLaObligacion: string;
  descripcionVencimiento: string;
  fechaInicio: string;
  fechaFin: string;
};

export function getObligaciones(csf: string) {
  const obligacionesSection = csf
    .match(/Obligaciones:\s+(.*?)\s+Sus\s+datos/)?.[1]
    .split(/Fecha\s+Fin/)[1];

  if (!obligacionesSection) return [];

  const regex =
    /\s*([^0-9]+?)\s+((?:A\s+m[aá]s\s+tardar\s+(?:el\s+(?:d[ií]a\s+)?\d{2}\s+)?[^\d]+)|(?:Conjuntamente\s+con\s+la\s+[^\d]+)|(?:Dentro\s+de\s+los\s+[^\d]+))\s+(\d{2}\/\d{2}\/\d{4})(\s+\d{2}\/\d{2}\/\d{4})?\s*/g;

  const obligaciones: ObligacionesEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(obligacionesSection)) !== null) {
    const [
      ,
      descripcionDeLaObligacion,
      descripcionVencimiento,
      fechaInicio,
      fechaFin,
    ] = match;

    obligaciones.push({
      descripcionDeLaObligacion: descripcionDeLaObligacion.trim(),
      descripcionVencimiento: descripcionVencimiento.trim(),
      fechaInicio: fechaInicio.trim(),
      fechaFin: fechaFin ? fechaFin.trim() : "",
    });
  }

  return obligaciones;
}
