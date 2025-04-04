const body = document.querySelector(".body")
const mainContainer = document.querySelector(".container");
const searchBtn = document.getElementById("serchBtn");
const sortBtn = document.querySelector(".sort");
const sortingOption =document.querySelector(".sortingOption");
const sortHover = document.getElementById("sort")
const options = document.querySelectorAll(".options")
let searchState = true;
let allBooks;
let pages;
let sortedData;

// Get data from the API
async function getData(l, add) {
  l = l || 1;
  add = add || 12;
  try {
    const result = await fetch(
      `https://api.freeapi.app/api/v1/public/books?limit=${add}&page=${l}`
    );
    const data = await result.json();
    const books = data.data;
    return books;
  } catch (err) {
    console.log(err);
  }
}

// Get books from the API
async function getBooks(l) {
  let books = await getData(l);
  books = books.data;
  if (books) {
    display(books);
  }
}

// display books
function display(books) {
  if (Array.isArray(books)) {
    books.forEach((book) => {
      render(book);
    });
  } else {
    render(books);
  }
}

// render books on display
function render(book) {
  const booksContainer = document.querySelector(".Books");
  const bookPreview = document.createElement("a");
  const booksCard = document.createElement("div");
  booksCard.classList.add("bookCard");
  const bookImage = document.createElement("div");
  bookImage.classList.add("bookImg");
  const bookTitle = document.createElement("div");
  bookTitle.classList.add("book-tittle");
  const categoryDescription = document.createElement("div");
  categoryDescription.classList.add("cat-dsc");
  const categoryDate = document.createElement("div");
  categoryDate.classList.add("category_date");

  // Extract data from the book object
  const imgSrc =
    book.volumeInfo.imageLinks?.thumbnail.split("&zoom")[0] ||
    "./ChatGPT Image Mar 30, 2025, 07_19_49 AM.png";
  const titleText = book.volumeInfo.title || "Unknown Title";
  const authorText = book.volumeInfo.authors?.join(", ") || "Unknown Author";
  const categoryText = book.volumeInfo.categories?.[0] || "Uncategorized";
  const publishedYear = book.volumeInfo.publishedDate
    ? new Date(book.volumeInfo.publishedDate).getFullYear()
    : "N/A";
  const descriptionText =
    book.volumeInfo.description || "No description available.";
  bookPreview.setAttribute("href", book.volumeInfo.previewLink);
  bookPreview.setAttribute("target", "_blank");
  bookPreview.setAttribute("rel", "noopener noreferrer");

  // Create DOM elements
  const img = document.createElement("img");
  img.setAttribute("loading", "lazy");
  img.src = imgSrc;
  img.setAttribute("alt", "book image");

  const title = document.createElement("h3");
  title.textContent = titleText;

  const author = document.createElement("p");
  author.textContent = authorText;

  const category = document.createElement("div");
  category.classList.add("category");
  category.textContent = categoryText;

  const date = document.createElement("span");
  date.classList.add("publish_date");
  date.textContent = publishedYear;

  const description = document.createElement("p");
  description.classList.add("dsc");
  description.textContent = descriptionText;

  bookImage.appendChild(img);
  bookTitle.appendChild(title);
  bookTitle.appendChild(author);
  categoryDate.appendChild(category);
  categoryDate.appendChild(date);
  categoryDescription.appendChild(categoryDate);
  categoryDescription.appendChild(description);
  booksCard.appendChild(bookImage);
  booksCard.appendChild(bookTitle);
  booksCard.appendChild(categoryDescription);
  bookPreview.appendChild(booksCard);
  booksContainer.appendChild(bookPreview);
}

// Pagination
async function pagination() {
  let books = await getData();
  books = books.totalItems;
  allBooks = books;
  pages = Math.ceil(books / 12);

  const pagination = document.createElement("div");
  pagination.classList.add("pagination");

  const prevBtn = document.createElement("button");
  prevBtn.classList.add("static");
  prevBtn.classList.add("pgnBtn");
  prevBtn.classList.add("hover");
  prevBtn.id = `prev`;
  prevBtn.onclick = moveToAnotherPage;
  prevBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>`;

  pagination.appendChild(prevBtn);

  for (let i = 1; i <= pages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.classList.add("pgnBtn");
    pageBtn.classList.add("hover");
    pageBtn.id = `page${i}`;
    pageBtn.textContent = i;
    pageBtn.onclick = moveToAnotherPage;
    pagination.appendChild(pageBtn);
  }

  const NextBtn = document.createElement("button");
  NextBtn.classList.add("static");
  NextBtn.classList.add("pgnBtn");
  NextBtn.classList.add("hover");
  NextBtn.id = `next`;
  NextBtn.onclick = moveToAnotherPage;
  NextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>`;

  pagination.appendChild(NextBtn);

  mainContainer.appendChild(pagination);
  prevBtn.setAttribute("disabled", true);
  prevBtn.style.cursor = "default";
  prevBtn.classList.remove("hover");
  document.querySelector("#page1").classList.add("active");
}

window.onload = () => {
  // Get books on page load
  getBooks();
  // Get pagination on page load
  pagination();
};

// Move to another page
function moveToAnotherPage() {
  if (this.classList.contains("active")) return;

  if (this.id === "prev") {
    let active = document.querySelector(".active");
    let page = parseInt(active.textContent);
    if (page === 2) {
      document.querySelector("#prev").setAttribute("disabled", true);
      document.querySelector("#prev").style.cursor = "default";
      document.querySelector("#prev").classList.remove("hover");
    }
    document.querySelector("#next").removeAttribute("disabled");
    document.querySelector("#next").style.cursor = "pointer";
    document.querySelector("#next").classList.add("hover");
    active.classList.remove("active");
    let prev = document.querySelector(`#page${page - 1}`);
    prev.classList.add("active");
    document.querySelector(".Books").innerHTML = "";
    const optionActive = document.querySelector(".option-active")
    !optionActive ? getBooks(page - 1) : sortedDisplay(page - 1)
    return;
  }

  if (this.id === "next") {
    let active = document.querySelector(".active");
    let page = parseInt(active.textContent);
    if (page === pages - 1) {
      document.querySelector("#next").setAttribute("disabled", true);
      document.querySelector("#next").style.cursor = "default";
      document.querySelector("#next").classList.remove("hover");
    }
    document.querySelector("#prev").removeAttribute("disabled");
    document.querySelector("#prev").style.cursor = "pointer";
    document.querySelector("#prev").classList.add("hover");
    active.classList.remove("active");
    let next = document.querySelector(`#page${page + 1}`);
    next.classList.add("active");
    document.querySelector(".Books").innerHTML = "";
    const optionActive = document.querySelector(".option-active")
    !optionActive ? getBooks(page + 1) : sortedDisplay(page + 1)
    return;
  }

  let page = this.textContent;

  if (page === "1") {
    document.querySelector("#prev").setAttribute("disabled", true);
    document.querySelector("#prev").style.cursor = "default";
    document.querySelector("#prev").classList.remove("hover");
    document.querySelector("#next").removeAttribute("disabled");
    document.querySelector("#next").style.cursor = "pointer";
    document.querySelector("#next").classList.add("hover");
  } else if (page === pages.toString()) {
    document.querySelector("#next").setAttribute("disabled", true);
    document.querySelector("#next").style.cursor = "default";
    document.querySelector("#next").classList.remove("hover");
    document.querySelector("#prev").removeAttribute("disabled");
    document.querySelector("#prev").style.cursor = "pointer";
    document.querySelector("#prev").classList.add("hover");
  } else {
    document.querySelector("#prev").removeAttribute("disabled");
    document.querySelector("#prev").style.cursor = "pointer";
    document.querySelector("#prev").classList.add("hover");
    document.querySelector("#next").removeAttribute("disabled");
    document.querySelector("#next").style.cursor = "pointer";
    document.querySelector("#next").classList.add("hover");
  }

  this.classList.add("active");
  document.querySelector(".Books").innerHTML = "";
  const optionActive = document.querySelector(".option-active")
    !optionActive ? getBooks(parseInt(page)) : sortedDisplay(parseInt(page))
  // getBooks(parseInt(page));
  document.querySelectorAll(".pgnBtn").forEach((b) => {
    if (b.textContent !== page) {
      b.classList.remove("active");
    }
  });
}

// handle search functionality
searchBtn.addEventListener("click", async () => {
  let count = 0;
  const input = document.getElementById("input").value;
  if (!input) return;
  let data = await getData(1, allBooks);
  data = data?.data;

  for (const e of data) {
    let result = input.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    if ( e.volumeInfo?.title.toLowerCase() === input.toLowerCase() || e.volumeInfo.authors?.includes(result)) {
      document.querySelector(".Books").innerHTML = "";
      display(e);
      const homeBtn = document.createElement("button");
      homeBtn.classList.add("homeBtn")
      homeBtn.innerText = "Home";
      homeBtn.onclick = () => {
      searchState = true;
      getBooks();
      this.pagination();
      document.getElementById("input").value = "";
      document.querySelector(".Books").innerHTML = "";
      mainContainer.removeChild(homeBtn)
    };
    mainContainer.appendChild(homeBtn)

      const pagination = document.querySelector(".pagination");
      if (pagination) mainContainer.removeChild(pagination);

      count++;
      break; // Exit the loop immediately
    }
  }
  
  if (!count && searchState) {
    const books = document.querySelector(".Books");
    books.innerHTML = "";
    const pagination = document.querySelector(".pagination");
    if (pagination) mainContainer.removeChild(pagination);
    const hBtn = document.querySelector(".homeBtn")
    if(hBtn)
      mainContainer.removeChild(hBtn)
    const div = document.createElement("div");
    div.classList.add("Emty");
    const msg = document.createElement("p");
    msg.textContent = `no records found`;
    const homeBtn = document.createElement("button");
    homeBtn.innerText = "Home";
    homeBtn.onclick = () => {
      searchState = true;
      getBooks();
      this.pagination();
      document.getElementById("input").value = "";
      books.removeChild(div);
    };
    div.appendChild(msg);
    div.appendChild(homeBtn);

    books.appendChild(div);
    searchState = false;
    return;
  }
});


// sort functinality

sortBtn.addEventListener("click", ()=>{
  if(sortingOption.style.display === "block"){
    sortingOption.style.display = "none";
    sortHover.classList.add("hover");
    body.style.overflow = "auto";
  }else{
    sortingOption.style.display = "block";
    sortHover.classList.remove("hover");
    body.style.overflow = "hidden";
  }
});



options.forEach(option =>{
  option.addEventListener("click", async()=>{
     getSortedData(option)
  })
})


async function getSortedData(option){
  let data = await getData(1, allBooks);
  data = data.data;
  let optionActive;
  let pagenumber;
  let parent;
  let disk
  switch (option.getAttribute("id")){
    case "option1" :
      sortedData = data.toSorted((a, b) =>
        a.volumeInfo.title.localeCompare(b.volumeInfo.title)
      );
      document.querySelector(".Books").innerHTML = "";
      optionActive = document.querySelector("option-active");
      optionActive ? optionActive.classList.remove("option-active") : "";
      document.getElementById("option1").classList.add("option-active");
      pagenumber = document.querySelector(".active").textContent;
      sortedDisplay(pagenumber);
      disk = document.querySelector(".disk");
      disk?.classList.remove("disk");
      parent = document.getElementById("option1").parentElement;
      parent.classList.add("disk")
      break;
    case "option2" :
      sortedData = data.toSorted((a, b) =>
        a.volumeInfo.title.localeCompare(b.volumeInfo.title)
      );
      sortedData.reverse();
      document.querySelector(".Books").innerHTML = "";
      optionActive = document.querySelector("option-active");
      optionActive ? optionActive.classList.remove("option-active") : "";
      document.getElementById("option2").classList.add("option-active");
      pagenumber = document.querySelector(".active").textContent;
      sortedDisplay(pagenumber);
      disk = document.querySelector(".disk");
      disk?.classList.remove("disk");
      parent = document.getElementById("option2").parentElement;
      parent.classList.add("disk")
      break;
    case "option3" :
      sortedData = data.toSorted((a, b) => {
        const authorA = a.volumeInfo.authors?.[0] || "";
        const authorB = b.volumeInfo.authors?.[0] || "";
        return authorA.localeCompare(authorB);
      });
      document.querySelector(".Books").innerHTML = "";
      optionActive = document.querySelector("option-active");
      optionActive ? optionActive.classList.remove("option-active") : "";
      document.getElementById("option3").classList.add("option-active");
      pagenumber = document.querySelector(".active").textContent;
      sortedDisplay(pagenumber);
      disk = document.querySelector(".disk");
      disk?.classList.remove("disk");
      parent = document.getElementById("option3").parentElement;
      parent.classList.add("disk")
      break;
    case "option4" :
      sortedData = data.toSorted((a, b) => {
        const authorA = a.volumeInfo.authors?.[0] || "";
        const authorB = b.volumeInfo.authors?.[0] || "";
        return authorA.localeCompare(authorB);
      });
      sortedData.reverse();
      document.querySelector(".Books").innerHTML = "";
      optionActive = document.querySelector("option-active");
      optionActive ? optionActive.classList.remove("option-active") : "";
      document.getElementById("option4").classList.add("option-active");
      pagenumber = document.querySelector(".active").textContent;
      sortedDisplay(pagenumber);
      disk = document.querySelector(".disk");
      disk?.classList.remove("disk");
      parent = document.getElementById("option4").parentElement;
      parent.classList.add("disk")
      break;
    case "option5" :
      sortedData = data.toSorted((a, b) => {
        const ADate = new Date(a.volumeInfo.publishedDate).getFullYear() || 1;
        const BDate = new Date(b.volumeInfo.publishedDate).getFullYear() || 1;
        return ADate-BDate;
      });
      document.querySelector(".Books").innerHTML = "";
      optionActive = document.querySelector("option-active");
      optionActive ? optionActive.classList.remove("option-active") : "";
      document.getElementById("option5").classList.add("option-active");
      pagenumber = document.querySelector(".active").textContent;
      sortedDisplay(pagenumber);
      disk = document.querySelector(".disk");
      disk?.classList.remove("disk");
      parent = document.getElementById("option5").parentElement;
      parent.classList.add("disk")
      break;
    case "option6" :
      sortedData = data.toSorted((a, b) => {
        const ADate = new Date(a.volumeInfo.publishedDate).getFullYear() || 1;
        const BDate = new Date(b.volumeInfo.publishedDate).getFullYear() || 1;
        return ADate-BDate;
      });
      sortedData.reverse()
      document.querySelector(".Books").innerHTML = "";
      optionActive = document.querySelector("option-active");
      optionActive ? optionActive.classList.remove("option-active") : "";
      document.getElementById("option6").classList.add("option-active");
      pagenumber = document.querySelector(".active").textContent;
      sortedDisplay(pagenumber);
      disk = document.querySelector(".disk");
      disk?.classList.remove("disk");
      parent = document.getElementById("option6").parentElement;
      parent.classList.add("disk")
      break;
   }
  
}


function sortedDisplay(pageNumber){
  pageNumber = parseInt(pageNumber)
  const displayData = sortedData.slice((pageNumber-1)*12, pageNumber*12)
  display(displayData)
}