import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Welcome = ({user}) => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const styles1 = {
    fontSize: '36px',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  };
  const styles2 = {
    fontSize: '18px',
    color: '#0F2D1D',
    fontFamily: 'Arial, sans-serif'
  };

  const handleWelcome = () => {
    toast.success(`Welcome, @_${user.username}! to the ${user.role} dashboard`);
  };

  const handleEnableRequest = () => {
    toast.success(`Email sent to @NewsDaily!`);
  };

  useEffect(() => {
    const fullText1 = user.username ? `Welcome, @_${user.username}!` : "";
    var fullText2 = '';
    if (user.isDisabled === true && user.role === "REPORTER") {
      fullText2 = `You are currently disabled. Please press the button below to contact to relevant authorities via email`;
    }
    else {
      fullText2 = `This is the ${user.role} dashboard of the NewsDaily Web Application.`;
    }

    let currentIndex1 = 0;
    const interval1 = setInterval(() => {
      if (currentIndex1 <= fullText1.length) {
        setText1(fullText1.slice(0, currentIndex1));
        currentIndex1 += 1;
      } else {
        clearInterval(interval1);

        let currentIndex2 = 0;
        const interval2 = setInterval(() => {
          if (currentIndex2 <= fullText2.length) {
            setText2(fullText2.slice(0, currentIndex2));
            currentIndex2 += 1;
          } else {
            clearInterval(interval2);
          }
        }, 50);
      }
    }, 100);

    return () => clearInterval(interval1);
  }, [user.username, user.role]);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <h1 style={styles1}>{text1}</h1>
          <p style={styles2}>{text2}</p>
          {(user.isDisabled === true && user.role === 'REPORTER') ? (
            <button
              className="btn btn-primary"
              onClick={handleEnableRequest}
              style={{ border: "1px solid #008080" }}
            >
              Email to @NewsDaily
            </button>
          ) : (
            <>
              <button
                className="btn btn-primary"
                onClick={handleWelcome}
                style={{ border: "1px solid #008080" }}
              >
                Welcome!
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
