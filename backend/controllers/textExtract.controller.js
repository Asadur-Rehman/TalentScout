import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const extractText = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded!" });
    }

    const { buffer, mimetype } = req.file;
    let extractedText = "";

    if (mimetype === "application/pdf") {
      try {
        const data = await pdfParse(buffer);
        extractedText = data.text;
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        return res
          .status(500)
          .json({ success: false, message: "Error parsing PDF!" });
      }
    } else if (
      mimetype === "application/msword" ||
      mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Unsupported file type!" });
    }

    res.json({ success: true, text: extractedText });
  } catch (error) {
    console.error("Text extraction error:", error);
    res.status(500).json({ success: false, message: "Error extracting text!" });
  }
};
