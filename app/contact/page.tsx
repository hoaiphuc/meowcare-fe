import React from "react";

const Contact: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "#fffaf5",
        minHeight: "100vh",
        padding: "50px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src="/meow.png" // Thay đường dẫn này bằng đường dẫn tới logo của bạn
            alt="Logo"
            style={{
              maxWidth: "150px",
              height: "auto",
              display: "block", // Căn giữa theo chiều ngang
              margin: "0 auto", // Căn giữa theo chiều ngang khi dùng display: block
            }}
          />
        </div>
        <h1
          style={{
            textAlign: "center",
            color: "#333333",
            marginBottom: "20px",
            fontSize: "24px",
          }}
        >
          Liên hệ với chúng tôi
        </h1>

        <form>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#666666",
                marginBottom: "8px",
              }}
            >
              Họ và tên
            </label>
            <input
              id="name"
              type="text"
              placeholder="Điền tên của bạn"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #cccccc",
                backgroundColor: "#f9f9f9",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#666666",
                marginBottom: "8px",
              }}
            >
              Email của bạn
            </label>
            <input
              id="email"
              type="email"
              placeholder="Điền Email của bạn"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #cccccc",
                backgroundColor: "#f9f9f9",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="message"
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#666666",
                marginBottom: "8px",
              }}
            >
              Nội dung
            </label>
            <textarea
              id="message"
              placeholder="Viết nôi dung"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #cccccc",
                backgroundColor: "#f9f9f9",
                minHeight: "80px",
              }}
            ></textarea>
          </div>
          <button
            type="submit"
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#902C6C",
              color: "#ffffff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
