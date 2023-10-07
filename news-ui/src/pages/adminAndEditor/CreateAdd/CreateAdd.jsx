import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CreateAdd = () => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        isApproved: false,
        isDisabled: false,
        isAd: true,
        selectedTags: []
      });
    
      const [allTags, setAllTags] = useState([]);
    
      const fetchAllTags = async () => {
        try {
          const response = await axios.get("/api/v1/tags");
    
          if (Array.isArray(response.data)) {
            setAllTags(response.data);
          } else {
            console.error("Invalid data format received from the server.");
          }
        } catch (error) {
          console.error(error);
        }
      };
      
      useEffect(() => {
        fetchAllTags();
      }, []);
        
      const handleChange = e => {
        const { name, value } = e.target;
    
        if (name === "tags") {
          const selectedTags = [...formData.selectedTags];
    
          if (selectedTags.includes(value)) {
            const index = selectedTags.indexOf(value);
            if (index !== -1) {
              selectedTags.splice(index, 1);
            }
          } else {
            selectedTags.push(value);
          }
    
          setFormData({
            ...formData,
            selectedTags
          });
        } else {
          setFormData({
            ...formData,
            [name]: value
          });
        }
      };
    
      const handleSubmit = async e => {
        e.preventDefault();
        try {
          const tagsParam = formData.selectedTags.join(","); // Convert selected tags to a comma-separated string
          await axios.post(
            `/api/v1/news?tags=${tagsParam}`, // Send tags as a query parameter
            {
              ...formData
            }
          );
          toast.success("ADD is Active now!");
        } catch (error) {
          toast.error("Error creating add");
          console.error(error);
        }
      };
    
      return (
        <div className="container mt-5 my-5 accHoldContainer">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1>Create a New ADD</h1>
              <div
                style={{
                  background: "black",
                  height: "1px",
                  width: "21%",
                  margin: "auto",
                  marginBottom: "8px"
                }}
              ></div>
              <p>Add details below</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-7 mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title of ADD
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
    
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    Content of ADD
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Choose the tags where to show this ADD</label>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {allTags.map((tag, index) => (
                      <span key={tag.id} style={{ marginRight: "8px" }}>
                        <label>
                          <input
                            type="checkbox"
                            name="tags"
                            value={tag.id.toString()}
                            checked={formData.selectedTags.includes(
                              tag.id.toString()
                            )}
                            onChange={handleChange}
                          />
                          {tag.name}
                        </label>
                      </span>
                    ))}
                  </div>
                </div>
    
                <button type="submit" className="btn btn-primary">
                  Activate Add
                </button>
              </form>
            </div>
          </div>
        </div>
      );
};

export default CreateAdd;