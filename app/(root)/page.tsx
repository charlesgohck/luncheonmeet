import HomeAboutSection from "../components/HomeAboutSection";
import HomeFAQSection from "../components/HomeFAQSection";
import HomeFeaturesSection from "../components/HomeFeaturesSection";
import HomeHero from "../components/HomeHero";

export default function Home() {
    return (
        <div>
            <HomeHero />
            <HomeFeaturesSection/>
            <HomeAboutSection/>
            <HomeFAQSection/>
        </div>
    );
}
