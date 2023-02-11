import { useContext } from "react";
import { context } from "../contexts/context";
export default function AmountChip({amount}) {
  const {chipAmount, setChipAmount } = useContext(context);
  return (
    <div className="chip_item">
      <div className={chipAmount===amount? "chip_container_item selected_chip" : "chip_container_item"}  onClick={()=> setChipAmount(amount)}>
        {amount}
      </div>
    </div>
  );
}
