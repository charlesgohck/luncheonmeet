import HomeAboutSection from "../components/HomeAboutSection";
import HomeFAQSection from "../components/HomeFAQSection";
import HomeFeaturesSection from "../components/HomeFeaturesSection";
import HomeHero from "../components/HomeHero";

export default function Home() {
    return (
        <div className="max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl mx-auto">
            <HomeHero />
            <HomeFeaturesSection/>
            <HomeAboutSection/>
            <HomeFAQSection/>
        </div>
    );
}
