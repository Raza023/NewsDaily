import React, { useEffect, useState } from "react";
import axios from "axios";

function AddComponent() {
  const [ads, setAds] = useState([]);
  const [isAdVisible, setIsAdVisible] = useState(false);

  const showAdAfterDelay = delayInSeconds => {
    setTimeout(() => {
      setIsAdVisible(true);
    }, delayInSeconds * 1000);
  };

  const fetchAllAds = async () => {
    try {
      const response = await axios.get("/api/v1/news/my-ads", {
        withCredentials: true,
        headers: {
          Authorization: "Basic " + btoa("admin:admin")
        }
      });

			if (response.status === 200) {
				const newAds = response.data;
				setAds(newAds);
			} else {
				console.error("Failed to fetch Ad");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

  useEffect(() => {
    showAdAfterDelay(20);

    const intervalId = setInterval(() => {
      if (!isAdVisible) {
        showAdAfterDelay(0);
      }
    }, 20000);

    // Fetch new ads after 20 seconds
    const fetchNewAdsInterval = setInterval(() => {
      fetchAllAds();
    }, 20000);

    return () => {
      clearInterval(intervalId);
      clearInterval(fetchNewAdsInterval);
    };
  }, [isAdVisible]);

  const handleHideAd = () => {
    setIsAdVisible(false);
    showAdAfterDelay(20);
  };

  return (
    <div className="container">
      {isAdVisible && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 999,
            maxWidth: "300px",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px", 
            padding: "10px", 
            fontFamily: "Arial, sans-serif", 
            color: "#333" 
          }}
          className="ad-panel"
        >
          {ads.length > 0 ? (
            <>
              <button
                className="close-button"
                onClick={handleHideAd}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "transparent",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#888"
                }}
              >
                X
              </button>
              <div className="py-3">
                {ads.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th scope="col">Ad Title</th>
                        <th scope="col">Ad Content</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ads.map((ad, index) => (
                        <tr key={index}>
                          <td>{ad.title}</td>
                          <td>{ad.content}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p></p>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
export default AddComponent;
