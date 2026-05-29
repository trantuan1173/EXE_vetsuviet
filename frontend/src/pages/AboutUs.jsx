import { Link } from 'react-router-dom';
import heroBg from '../assets/Nen web 1.png';
import quoteImg from '../assets/aboutUs.png';
import logoIcon from '../assets/Logo 3 1.png';

const AboutUs = () => {
    return (
        <div className="text-[#111827]">
            {/* ===== HERO SECTION ===== */}
            <section
                className="relative min-h-[815px] bg-cover bg-center"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-[#6F0D0D]/70" />

                <div className="relative z-10 flex flex-col items-center justify-center min-h-[815px] px-6 text-center">
                    {/* Subtitle */}
                    <p
                        className="text-xs font-bold tracking-[0.3em] uppercase mb-6"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#F0BE71' }}
                    >
                        HÀNH TRÌNH TÌM VỀ CỘI NGUỒN
                    </p>

                    {/* Heading */}
                    <h1
                        className="text-white leading-[60px] mb-4"
                        style={{ fontFamily: "'EB Garamond', serif", fontWeight: 600, fontSize: '60px', letterSpacing: '-0.02em' }}
                    >
                        Lịch sử không nên chỉ được học.
                        <br />
                        <span className="italic font-medium" style={{ color: '#FFDAD6' }}>
                            Lịch sử cần để lại dấu ấn.
                        </span>
                    </h1>

                    {/* Description */}
                    <p
                        className="max-w-[672px] mt-2 text-center leading-[29px] opacity-90"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '18px', color: '#ECE8E0' }}
                    >
                        Chúng tôi không chỉ kể lại những mốc thời gian khô khan. Vết Sử Việt kiến tạo một
                        hệ sinh thái học thuật đầy cảm xúc, nơi kiến thức hệ thống hòa quyện cùng trải
                        nghiệm thị giác sống động.
                    </p>

                    {/* CTA Button */}
                    <div className="mt-8">
                        <Link
                            to="/courses"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded text-white font-bold text-base"
                            style={{
                                fontFamily: "'Hanken Grotesk', sans-serif",
                                backgroundColor: '#6F0D0D',
                                boxShadow: '0px 8px 10px -6px rgba(75,0,3,0.2), 0px 20px 25px -5px rgba(75,0,3,0.2)',
                            }}
                        >
                            Bắt đầu hành trình
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== THE MEANING SECTION ===== */}
            <section className="bg-[#FFF7E4] py-[120px] px-6 lg:px-16">
                {/* Section heading */}
                <div className="text-center mb-16">
                    <h2
                        className="mb-4"
                        style={{ fontFamily: "'Hepta Slab', serif", fontWeight: 500, fontSize: '48px', lineHeight: '40px', color: '#4B0003' }}
                    >
                        Ý nghĩa cái tên "Vết Sử Việt"
                    </h2>
                    <div className="mx-auto w-24 h-1 bg-[#7D5713]" />
                </div>

                {/* Three cards */}
                <div className="max-w-[1152px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card: Vết */}
                    <div className="relative bg-[#F8F3EB] border border-[#DEBFBC] p-10 overflow-hidden">
                        <span
                            className="absolute top-[-39px] left-[73px] select-none pointer-events-none"
                            style={{ fontFamily: "'Hepta Slab', serif", fontWeight: 400, fontSize: '180px', lineHeight: '270px', color: 'rgba(75,0,3,0.05)' }}
                        >
                            Vết
                        </span>
                        <div className="relative z-10 mt-32">
                            <div className="w-16 h-16 rounded-xl bg-[#6F0D0D] flex items-center justify-center mb-4">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                                    <path d="M2 2l7.586 7.586" />
                                    <circle cx="11" cy="11" r="2" />
                                </svg>
                            </div>
                            <h3
                                className="text-xl font-bold mb-3"
                                style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#4B0003' }}
                            >
                                Dấu vết thời gian
                            </h3>
                            <p
                                className="text-sm leading-relaxed"
                                style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#57413F' }}
                            >
                                Là "vết hằn" trong tâm trí. Chúng tôi
                                tập trung vào khả năng ghi nhớ lâu
                                dài thông qua các phương pháp học
                                tập chủ động và kích thích đa giác
                                quan, để mỗi câu chuyện không chỉ
                                trôi qua mà đọng lại sâu sắc.
                            </p>
                        </div>
                    </div>

                    {/* Card: Sử */}
                    <div className="relative bg-[#F2EDE5] border border-[#DEBFBC] p-10 overflow-hidden">
                        <span
                            className="absolute top-[-39px] left-[145px] select-none pointer-events-none"
                            style={{ fontFamily: "'Hepta Slab', serif", fontWeight: 400, fontSize: '180px', lineHeight: '270px', color: 'rgba(75,0,3,0.05)' }}
                        >
                            Sử
                        </span>
                        <div className="relative z-10 mt-32">
                            <div className="w-16 h-16 rounded-xl bg-[#7D5713] flex items-center justify-center mb-4">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                    <line x1="8" y1="7" x2="16" y2="7" />
                                    <line x1="8" y1="11" x2="13" y2="11" />
                                </svg>
                            </div>
                            <h3
                                className="text-xl font-bold mb-3"
                                style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#4B0003' }}
                            >
                                Dòng chảy lịch sử
                            </h3>
                            <p
                                className="text-sm leading-relaxed"
                                style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#57413F' }}
                            >
                                Là tính hệ thống và logic. Kiến thức
                                lịch sử tại đây được chuẩn hóa, xâu
                                chuỗi một cách khoa học, giúp người
                                học nắm bắt được dòng chảy nhân
                                quả của dân tộc từ thuở hồng hoang
                                đến hiện đại.
                            </p>
                        </div>
                    </div>

                    {/* Card: Việt */}
                    <div className="relative bg-[#F8F3EB] border border-[#DEBFBC] p-10 pb-16 overflow-hidden">
                        <span
                            className="absolute top-[-39px] left-[1px] select-none pointer-events-none"
                            style={{ fontFamily: "'Hepta Slab', serif", fontWeight: 400, fontSize: '180px', lineHeight: '270px', color: 'rgba(75,0,3,0.05)' }}
                        >
                            Việt
                        </span>
                        <div className="relative z-10 mt-32">
                            <div className="w-16 h-16 rounded-xl bg-[#4C2E2C] flex items-center justify-center mb-4">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                            </div>
                            <h3
                                className="text-xl font-bold mb-3"
                                style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#4B0003' }}
                            >
                                Bản sắc Việt Nam
                            </h3>
                            <p
                                className="text-sm leading-relaxed"
                                style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#57413F' }}
                            >
                                Là bản sắc dân tộc. Chúng tôi đặt
                                người Việt trẻ vào trung tâm, khơi dậy
                                niềm tự hào và sự kết nối cá nhân với
                                di sản của cha ông, biến lịch sử thành
                                một phần của căn tính hiện đại.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== EDUCATIONAL PHILOSOPHY SECTION ===== */}
            <section className="bg-[#E7E2DA] py-[120px] px-6 lg:px-16">
                <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-center gap-20">
                    {/* Left: Image */}
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <img
                                src={quoteImg}
                                alt="Educational Philosophy"
                                className="w-full h-[600px] object-cover rounded shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
                            />
                            {/* Overlay card */}
                            <div
                                className="absolute bottom-6 right-[-20px] bg-[#FEF9F1] border border-[#DEBFBC] p-8 rounded hidden lg:block"
                                style={{ maxWidth: '320px' }}
                            >
                                <p className="text-sm font-medium" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#4B0003' }}>
                                    "Lịch sử không chỉ nằm trong sách vở, mà sống trong cách chúng ta kể lại và truyền cảm hứng."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1">
                        <p
                            className="text-base tracking-[0.2em] mb-4"
                            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 400, color: '#6F0D0D' }}
                        >
                            TRIẾT LÝ GIÁO DỤC
                        </p>
                        <h2
                            className="mb-8"
                            style={{ fontFamily: "'EB Garamond', serif", fontWeight: 500, fontSize: '48px', lineHeight: '48px', color: '#4B0003' }}
                        >
                            Hành trình từ tiếp nhận
                            <br />
                            đến kết nối di sản
                        </h2>

                        <div className="space-y-10">
                            {[
                                {
                                    step: '01',
                                    title: 'Tiếp nhận tri thức',
                                    desc: 'Hệ thống bài học được biên soạn khoa học, giúp người học nắm vững kiến thức nền tảng.',
                                },
                                {
                                    step: '02',
                                    title: 'Trải nghiệm cảm xúc',
                                    desc: 'Kết hợp hình ảnh, âm thanh và câu chuyện để tạo nên trải nghiệm học đầy cảm hứng.',
                                },
                                {
                                    step: '03',
                                    title: 'Ghi nhớ sâu sắc',
                                    desc: 'Phương pháp lặp lại ngắt quãng và quiz tương tác giúp kiến thức được khắc sâu.',
                                },
                                {
                                    step: '04',
                                    title: 'Kết nối di sản',
                                    desc: 'Biến kiến thức thành hành động, kết nối thế hệ trẻ với di sản văn hóa dân tộc.',
                                },
                            ].map((item) => (
                                <div key={item.step} className="flex gap-6">
                                    <div
                                        className="flex-shrink-0 w-12 h-12 rounded-full bg-[#6F0D0D] text-white flex items-center justify-center font-bold text-sm"
                                        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                                    >
                                        {item.step}
                                    </div>
                                    <div>
                                        <h4
                                            className="text-lg font-bold mb-1"
                                            style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#4B0003' }}
                                        >
                                            {item.title}
                                        </h4>
                                        <p
                                            className="text-sm leading-relaxed"
                                            style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#57413F' }}
                                        >
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== MISSION STATEMENT SECTION ===== */}
            <section className="relative py-[120px] overflow-hidden" style={{ backgroundColor: '#4B0003' }}>
                {/* Background image with low opacity */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${heroBg})` }}
                />
                {/* Gradient overlay */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(90deg, rgba(75,0,3,1) 0%, rgba(75,0,3,0.8) 50%, rgba(75,0,3,1) 100%)' }}
                />

                <div className="relative z-10 max-w-[1152px] mx-auto px-6 text-center flex flex-col items-center gap-8">
                    <h2
                        className="text-white"
                        style={{ fontFamily: "'EB Garamond', serif", fontWeight: 400, fontStyle: 'italic', fontSize: '72px', lineHeight: '72px' }}
                    >
                        Biến lịch sử thành trải nghiệm đáng nhớ.
                    </h2>
                    <div className="w-32 h-1" style={{ backgroundColor: '#F0BE71' }} />
                    <p
                        className="max-w-[768px] opacity-80"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', lineHeight: '32px', color: '#FFDDAF' }}
                    >
                        Sứ mệnh của chúng tôi là hồi sinh dòng máu Lạc Hồng trong từng nhịp
                        đập của thế hệ trẻ thông qua ngôn ngữ của nghệ thuật và công nghệ
                        hiện đại.
                    </p>
                </div>
            </section>

            {/* ===== VALUES GRID SECTION ===== */}
            <section className="bg-[#FFF7E4] py-[120px] px-6 lg:px-16">
                <div className="max-w-[1152px] mx-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-16 gap-6">
                        <div>
                            <p
                                className="text-base tracking-[0.2em] mb-4"
                                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 400, color: '#6F0D0D' }}
                            >
                                GIÁ TRỊ CỐT LÕI
                            </p>
                            <h2
                                style={{ fontFamily: "'Hepta Slab', serif", fontWeight: 500, fontSize: '48px', lineHeight: '48px', color: '#4B0003' }}
                            >
                                Những giá trị định danh
                                <br />
                                bản sắc Vết Sử Việt
                            </h2>
                        </div>
                        <Link
                            to="/about"
                            className="flex items-center gap-2 font-bold text-base"
                            style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#4B0003' }}
                        >
                            Khám phá văn hóa công ty
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#4B0003" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>

                    {/* 4 Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7D5713" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v6l4 2" />
                                    </svg>
                                ),
                                title: 'Ghi nhớ lâu dài',
                                desc: 'Phương pháp khoa học giúp kiến thức tồn tại mãi mãi trong tâm trí người học.',
                            },
                            {
                                icon: (
                                    <svg width="24" height="28" viewBox="0 0 24 24" fill="none" stroke="#7D5713" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                ),
                                title: 'Kết nối cảm xúc',
                                desc: 'Mỗi bài học là một rung cảm trước vẻ đẹp của cha ông và tinh thần dân tộc.',
                            },
                            {
                                icon: (
                                    <svg width="24" height="32" viewBox="0 0 24 24" fill="none" stroke="#7D5713" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                ),
                                title: 'Tự hào bản sắc',
                                desc: 'Khẳng định giá trị Việt trong dòng chảy toàn cầu thông qua tri thức lịch sử.',
                            },
                            {
                                icon: (
                                    <svg width="24" height="30" viewBox="0 0 24 24" fill="none" stroke="#7D5713" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                ),
                                title: 'Sáng tạo di sản',
                                desc: 'Không chỉ bảo tồn, chúng tôi sáng tạo những cách tiếp cận mới mẻ và độc bản.',
                            },
                        ].map((card) => (
                            <div
                                key={card.title}
                                className="bg-[#FEF9F1] border border-[#E8E1D3] p-8 flex flex-col gap-4"
                            >
                                <div>{card.icon}</div>
                                <h4
                                    className="text-xl font-bold pt-2"
                                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#1D1C17' }}
                                >
                                    {card.title}
                                </h4>
                                <p
                                    className="text-sm leading-[22.75px]"
                                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#57413F' }}
                                >
                                    {card.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* ===== CLOSING SECTION ===== */}
            <section className="relative bg-[#F2EDE5] py-[120px] overflow-hidden">
                {/* Abstract pattern */}
                <div className="absolute top-[-128px] right-0 w-64 h-64 opacity-5">
                    <div className="w-full h-full border-[40px] border-[#4B0003] rounded-xl" />
                </div>

                <div className="relative z-10 max-w-[1312px] mx-auto px-6 lg:px-16 flex flex-col items-center text-center gap-6">
                    {/* Logo */}
                    <img
                        src={logoIcon}
                        alt="Vết Sử Việt"
                        className="w-[107px] h-[80px] object-contain opacity-80"
                    />

                    {/* Heading */}
                    <h2
                        className="pt-6"
                        style={{ fontFamily: "'EB Garamond', serif", fontWeight: 500, fontSize: '60px', lineHeight: '60px', color: '#4B0003' }}
                    >
                        Không chỉ truyền đạt kiến thức.
                        <br />
                        Chúng tôi muốn để lại dấu ấn.
                    </h2>

                    {/* Description */}
                    <p
                        className="max-w-[672px] italic"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', lineHeight: '24px', color: '#57413F' }}
                    >
                        Cùng Vết Sử Việt viết tiếp những trang sử hào hùng bằng niềm tự hào và tri thức của thế hệ
                        hôm nay.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap justify-center gap-6 pt-6">
                        <Link
                            to="/register"
                            className="px-10 py-[17.5px] rounded-xl text-white font-bold text-base"
                            style={{
                                fontFamily: "'Hanken Grotesk', sans-serif",
                                backgroundColor: '#4B0003',
                                boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)',
                            }}
                        >
                            Gia nhập cộng đồng
                        </Link>
                        <Link
                            to="/contact"
                            className="px-10 py-4 rounded-xl font-bold text-base border-2"
                            style={{
                                fontFamily: "'Hanken Grotesk', sans-serif",
                                color: '#4B0003',
                                borderColor: '#4B0003',
                            }}
                        >
                            Liên hệ chúng tôi
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;