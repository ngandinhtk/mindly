export const quotes = [
  {
    text: "Hạnh phúc không phải là đích đến, mà là cách ta đi",
    author: "Thích Nhất Hạnh"
  },
  {
    text: "Mỗi ngày là một trang mới trong cuốn sách cuộc đời của bạn",
    author: "Unknown"
  },
  {
    text: "Nụ cười của bạn có thể thay đổi cả ngày của ai đó",
    author: "Unknown"
  },
  {
    text: "Hôm nay khó khăn, ngày mai sẽ tốt hơn",
    author: "Unknown"
  },
  {
    text: "Bình an đến từ bên trong, đừng tìm kiếm nó từ bên ngoài",
    author: "Buddha"
  },
  {
    text: "Mỗi cảm xúc đều có giá trị của nó, hãy đón nhận và thấu hiểu",
    author: "Unknown"
  },
  {
    text: "Hạnh phúc nhỏ nhất cũng là hạnh phúc",
    author: "Unknown"
  },
  {
    text: "Mọi việc sẽ ổn thôi, tin vào điều đó",
    author: "Unknown"
  },
  {
    text: "Yêu thương bản thân là khởi đầu của một cuộc phiêu lưu suốt đời",
    author: "Oscar Wilde"
  },
  {
    text: "Đừng để ngày hôm qua chiếm quá nhiều thời gian của ngày hôm nay",
    author: "Will Rogers"
  },
  {
    text: "Cuộc sống là 10% điều xảy ra với bạn và 90% là cách bạn phản ứng với nó",
    author: "Charles R. Swindoll"
  },
  {
    text: "Hãy là phiên bản tốt nhất của chính mình",
    author: "Unknown"
  },
  {
    text: "Đôi khi những điều tồi tệ nhất lại dẫn đến những điều tốt đẹp nhất",
    author: "Unknown"
  },
  {
    text: "Giọt nước có thể làm tràn ly, nhưng cũng có thể làm nở hoa",
    author: "Unknown"
  },
  {
    text: "Mỗi bước đi nhỏ đều đưa ta đến gần hơn với mục tiêu",
    author: "Unknown"
  },
  {
    text: "Khi bạn thay đổi cách nhìn về mọi thứ, những thứ bạn nhìn cũng sẽ thay đổi",
    author: "Wayne Dyer"
  },
  {
    text: "Đừng so sánh bản thân với người khác, hãy so sánh với chính mình của ngày hôm qua",
    author: "Unknown"
  },
  {
    text: "Điều quan trọng không phải là vấp ngã mấy lần, mà là đứng dậy được bao nhiêu lần",
    author: "Unknown"
  },
  {
    text: "Mỗi ngày đều là cơ hội để bắt đầu lại",
    author: "Unknown"
  },
  {
    text: "Hãy dành thời gian để làm những điều khiến tâm hồn bạn hạnh phúc",
    author: "Unknown"
  },
  {
    text: "Sống chậm lại, cảm nhận nhiều hơn",
    author: "Unknown"
  },
  {
    text: "Không có cảm xúc nào là sai, chỉ có cách ta phản ứng với nó",
    author: "Unknown"
  },
  {
    text: "Mỗi hơi thở là một món quà của cuộc sống",
    author: "Thích Nhất Hạnh"
  },
  {
    text: "Hạnh phúc đến từ việc biết đủ",
    author: "Unknown"
  },
  {
    text: "Bạn không thể thay đổi quá khứ, nhưng bạn có thể bắt đầu thay đổi từ bây giờ",
    author: "Unknown"
  }
]

// Function to get a random quote for the day
export const getDailyQuote = () => {
  // Use the current date as seed for random selection
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const randomIndex = seed % quotes.length;
  return quotes[randomIndex];
}

// Function to get random quote for specific emotion
export const getQuoteForEmotion = (emotion) => {
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  return quotes[quoteIndex];
}
  
