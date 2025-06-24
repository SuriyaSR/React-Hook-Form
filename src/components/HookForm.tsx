
const HookForm = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold underline mb-4">React Hook Forms</h1>
      <form action=""> 
        <div className="form-group py-4">
          <label className="mb-1">First Name</label>
          <input className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="enter first name" />
        </div>
        <div className="form-group py-2">
          <label className="px-4">Email</label>
          <input className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" placeholder="enter email" />
        </div>
        <div className="form-group py-4">
          <label className="px-4">Password</label>
          <input className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="enter password" />
        </div>
        <div className="form-group py-4">
          <label className="px-4">Gender</label>
            <select className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select One</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
            </select>
        </div>
        <div className="form-group py-4">
          <label className="px-4">Age</label>
          <input className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="number" placeholder="enter age" />
        </div>
        <div className="form-group py-4">
            <input type="checkbox"/>
            <label className="px-2">Terms and Conditions</label>          
        </div>
        <button className="bg-[#091322] text-white px-8 py-2 rounded-sm text-xl cursor-pointer" type="submit">Submit</button>
      </form>
    </div>
  )
}

export default HookForm
