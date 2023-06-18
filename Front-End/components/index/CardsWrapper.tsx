import cardData from "../../utils/cardData";
import Card from "./Card";

const CardsWrapper = () => {
  return (
    <div className="grid grid-cols-5 divide-x-2 border-double border-8 rounded-xl">
      {cardData.map((card, idx) => {
        return <Card key={idx} title={card.title} text={card.text} />;
      })}
    </div>
  );
};

export default CardsWrapper;
