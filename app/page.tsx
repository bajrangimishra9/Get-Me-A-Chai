import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="w-full pb-10 overflow-x-hidden">
        {/* Hero Section */}
        <div className="text-white flex justify-center flex-col items-center min-h-[44vh] px-4 py-12 gap-4 text-center">
          <div className="font-bold text-3xl sm:text-4xl md:text-5xl flex items-center justify-center gap-2 flex-wrap">
            <span>Buy Me a Chai</span>
            <img className="w-12 sm:w-14 md:w-[60px]" src="/tea.gif" alt="tea" />
          </div>

          <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-xl">
            A platform for Chai Lovers to connect and enjoy. Buy now!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
            <Link href="/login">
              <button
                type="button"
                className="w-32 rounded-2xl text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium text-sm px-4 py-2.5 text-center leading-5"
              >
                Start Now
              </button>
            </Link>

            <Link href="/about">
              <button
                type="button"
                className="w-32 rounded-2xl text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium text-sm px-4 py-2.5 text-center leading-5"
              >
                Read More
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white h-0.5 opacity-10"></div>

        {/* Friends Section */}
        <div className="text-white container mx-auto px-4 py-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10">
            Your Friends can buy you a Chai
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
            <div className="item space-y-3 flex flex-col items-center text-center">
              <img
                className="bg-slate-400 rounded-full p-1 text-black w-20 sm:w-[82px]"
                src="/man.gif"
                alt="fund yourself"
              />
              <p className="font-bold">Fund yourself</p>
              <p className="text-center text-sm sm:text-base text-slate-200">
                Buy Chai at your own.
              </p>
            </div>

            <div className="item space-y-3 flex flex-col items-center text-center">
              <img
                className="bg-slate-400 rounded-full p-1 text-black w-20 sm:w-[82px]"
                src="/coin.gif"
                alt="receive chai support"
              />
              <p className="font-bold">Receive Chai Support</p>
              <p className="text-center text-sm sm:text-base text-slate-200">
                Ask friends for fund.
              </p>
            </div>

            <div className="item space-y-3 flex flex-col items-center text-center">
              <img
                className="bg-slate-400 rounded-full p-1 text-black w-20 sm:w-[82px]"
                src="/group.gif"
                alt="chai community"
              />
              <p className="font-bold">Chai With Community</p>
              <p className="text-center text-sm sm:text-base text-slate-200">
                Enjoy the Chai with People and gossips.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white h-0.5 opacity-10 my-6 sm:my-10"></div>

        {/* Learn More Section */}
        <div className="text-white container mx-auto px-4 pb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center my-8">
            Learn More about US
          </h2>

          <div className="flex justify-center">
            <video
              src="/chai.mp4"
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full max-w-[600px] rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}