import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
  fetchAllCupons,
  createCupon,
  deleteCupon,
} from "../../../redux/cuponSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Table from "../../../components/admin/Table";

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const allNumbers = "1234567890";
const allSymbols = "!@#$%^&*()_+";

const Coupon = () => {
  const dispatch = useDispatch();
  const { cupons } = useSelector((state) => state.coupon);

  useEffect(() => {
    dispatch(fetchAllCupons());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deleteCupon(id));
  };

  const [size, setSize] = useState(8);
  const [prefix, setPrefix] = useState("");
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeCharacters, setIncludeCharacters] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [amount, setAmount] = useState(1);
  const [coupon, setCoupon] = useState("");

  const handleAmmountChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1) {
      setAmount(value);
    }
  };

  const copyText = async (coupon) => {
    await window.navigator.clipboard.writeText(coupon);
    setIsCopied(true);
  };

  const couponData = {
    amount,
    coupon,
  };

  const cuponCreator = async (e) => {
    e.preventDefault();
    if (coupon === "") {
      toast.error("Please Generate Coupon First");
      return;
    }
    dispatch(createCupon(couponData));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!includeNumbers && !includeCharacters && !includeSymbols)
      return toast.error("Please Select One At Least");

    let result = prefix || "";
    const loopLength = size - result.length;

    for (let i = 0; i < loopLength; i++) {
      let entireString = "";
      if (includeCharacters) entireString += allLetters;
      if (includeNumbers) entireString += allNumbers;
      if (includeSymbols) entireString += allSymbols;

      const randomNum = ~~(Math.random() * entireString.length);
      result += entireString[randomNum];
    }

    setCoupon(result);
  };

  useEffect(() => {
    setIsCopied(false);
  }, [coupon]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h2>Coupon Code Generator</h2>
        <section>
          <form
            className="coupon-form"
            onSubmit={submitHandler}
            style={{ height: "30rem ", marginBottom: "2rem" }}>
            <input
              className="fir"
              type="text"
              placeholder="Text to include"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              maxLength={size}
              style={{ width: "100%", height: "3rem" }}
            />

            <input
              className="fir"
              type="number"
              placeholder="Coupon Length"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min={8}
              max={25}
              style={{ width: "100%", height: "3rem" }}
            />

            <fieldset>
              <legend>Include</legend>

              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers((prev) => !prev)}
              />
              <span>Numbers</span>

              <input
                type="checkbox"
                checked={includeCharacters}
                onChange={() => setIncludeCharacters((prev) => !prev)}
              />
              <span>Characters</span>

              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols((prev) => !prev)}
              />
              <span>Symbols</span>
            </fieldset>
            <button type="submit" style={{ width: "100%", height: "3rem" }}>
              Generate
            </button>
          </form>

          {coupon && (
            <code style={{ height: "2rem", marginTop: "2rem" }}>
              {coupon}{" "}
              <span onClick={() => copyText(coupon)}>
                {isCopied ? "Copied" : "Copy"}
              </span>{" "}
            </code>
          )}
        </section>
        <section className="create-coupon" style={{ height: "fit-content" }}>
          <h2 style={{ marginBottom: "2rem" }}>Create Coupon</h2>
          <form action="" onSubmit={cuponCreator}>
            <input
              className="fir"
              type="text"
              value={coupon}
              placeholder="Coupon Code"
              style={{ width: "100%", height: "3rem" }}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <input
              className="fir"
              type="number"
              value={`${amount}`}
              style={{ width: "100%", height: "3rem" }}
              onChange={(e) => handleAmmountChange(e)}
            />
            <button type="submit" style={{ width: "100%", height: "3rem" }}>
              Create
            </button>
          </form>
        </section>
        {/* <Table/> */}
      </main>
    </div>
  );
};

export default Coupon;
