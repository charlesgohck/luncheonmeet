import Image from "next/image";

export function Footer() {
    return (
        <footer className="footer p-10 flex justify-between">
            <aside>
                <Image src={"/images/Logo.png"} alt={"Luncheon Meet Logo"} width={80} height={80}/>
                <p>
                    Luncheon Meet
                    <br />
                    Making Connections over Lunch and Other Activties.
                </p>
            </aside>
            <nav>
                <h6 className="footer-title">Contact</h6>
                <div className="grid grid-flow-col gap-4">
                    <a href="mailto:iloveluncheonmeet@gmail.com?subject=LuncheonMeet%20Enquiries">
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                        <i className="fa fa-envelope" aria-hidden="true"></i>
                    </a>
                </div>
            </nav>
        </footer>
    )
}