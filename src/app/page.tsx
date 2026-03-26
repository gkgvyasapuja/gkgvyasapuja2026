import Hero from "@components/Home/Hero";
import BhagwatPadAshtakam from "@components/Home/BhagwatPadAshtakam";
import PrabhupadQuotes from "@components/Home/PrabhupadQuotes";
import Gallery from "@components/Home/Gallery";

export default function Home() {
  return (
    <div>
      <Hero />
      <BhagwatPadAshtakam />
      <PrabhupadQuotes />
      <Gallery />
    </div>
  );
}
