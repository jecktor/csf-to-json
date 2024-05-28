import { getGeneralData } from "./getGeneralData";
import { getActEconomicas } from "./getActEconomicas";
import { getRegimen } from "./getRegimen";
import { getObligaciones } from "./getObligaciones";

export function csfToJson(csfText: string) {
  const csf = csfText.replace(/Página\s+\[\d+\]\s+de\s+\[\d+\]/g, "");

  const generalData = getGeneralData(csf);
  const actividadesEconomicas = getActEconomicas(csf);
  const regimenes = getRegimen(csf);
  const obligaciones = getObligaciones(csf);

  return {
    generalData,
    actividadesEconomicas,
    regimenes,
    obligaciones,
  };
}
