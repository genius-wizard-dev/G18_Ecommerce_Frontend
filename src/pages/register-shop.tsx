"use client"

export default function RegisterShop() {
  return (
    <div className="bg-white w-full py-20 px-4 flex justify-center relative">
      <div className="relative w-full max-w-xl p-10 rounded-2xl bg-white border border-black/10 shadow-[0_0_40px_rgba(0,0,0,0.08)] hover:shadow-[0_0_160px_rgba(0,0,0,0.15)] transition-all duration-500 group scale-105 hover:scale-100">
        {/* Vạch sáng góc */}
        <div className="absolute top-0 left-0 w-10 h-10 bg-black group-hover:w-5 group-hover:h-5 transition-all duration-300 rounded-br-lg" />
        <div className="absolute bottom-0 right-0 w-10 h-10 bg-black group-hover:w-5 group-hover:h-5 transition-all duration-300 rounded-tl-lg" />

        <h2 className="text-3xl font-extrabold text-black text-center uppercase tracking-wider mb-8">
          Đăng ký shop
        </h2>

        <form className="space-y-6">
          <div>
            <label htmlFor="shopName" className="block text-black font-semibold mb-2">
              Tên Shop
            </label>
            <input
              id="shopName"
              type="text"
              placeholder="VD: The Shadow Room"
              className="w-full px-4 py-3 rounded-md bg-white border border-black/20 text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-bold rounded-md tracking-wide uppercase hover:bg-white hover:text-black border hover:border-black transition-all duration-300"
          >
            Đăng ký shop
          </button>
        </form>
      </div>
    </div>
  )
}
