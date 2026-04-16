const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7i54hKon1Dizk_ZgP6tpjNolJINeYLxPD4UdncQwMZUpUHgO4GI-NhzSC5o8IpaeZ/exec";

// --- 1. डेटा सेव करने वाला हिस्सा ---
document.addEventListener("submit", function(e) {
    const form = e.target;
    if (form.id === "searchForm") return;

    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    if (data.regMobile && data.regMobile.length !== 10) {
        alert("❌ त्रुटि: मोबाइल नंबर 10 अंकों का होना चाहिए!");
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if(submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "सेव हो रहा है... ⏳";
    }

    fetch(SCRIPT_URL, { 
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify(data) 
    })
    .then(() => {
        let type = (data.userType || "").toLowerCase().trim(); 
        alert("✅ सफलता: डेटा सुरक्षित कर लिया गया है!");
        form.reset();
        if (type === "booking") {
            window.location.href = 'payment-success.html';
        }
    })
    .catch(err => {
        alert("❌ त्रुटि: डेटा सेव नहीं हो सका।");
        console.error(err);
    })
    .finally(() => {
        if(submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "सबमिट करें";
        }
    });
});

// --- 2. सर्च और अन्य फंक्शन ---
async function searchWorkers() {
    const city = document.getElementById("cityInput").value.trim();
    const work = document.getElementById("workInput").value.trim();
    const resultsDiv = document.getElementById("results");

    if (!city || !work) {
        alert("शहर और काम की कैटेगरी चुनें।");
        return;
    }

    resultsDiv.innerHTML = "खोज रहे हैं... 🔍";

    try {
        const url = `${SCRIPT_URL}?action=search&city=${encodeURIComponent(city)}&work=${encodeURIComponent(work)}`;
        const response = await fetch(url);
        const workers = await response.json();

        resultsDiv.innerHTML = "";
        if (workers.length === 0) {
            resultsDiv.innerHTML = "<p style='color:red;'>❌ कोई कारीगर नहीं मिला।</p>";
            return;
        }

        workers.forEach(w => {
            resultsDiv.innerHTML += `
                <div class="worker-card">
                    <p><b>👤 नाम:</b> ${w.name}</p>
                    <p><b>🔧 काम:</b> ${w.work}</p>
                    <button onclick="showBookingForm()" style="background:#27ae60; color:white; padding:10px; border:none; border-radius:5px; width:100%;">अभी बुक करें</button>
                </div>`;
        });
    } catch (e) {
        resultsDiv.innerHTML = "खोजने में समस्या आई।";
    }
}

// --- 3. बुकिंग और रजिस्ट्रेशन हैंडलिंग (सुधारा हुआ हिस्सा) ---
const bookingForm = document.getElementById("bookingForm");
const bookingBtn = document.querySelector("#bookingForm .submit-btn");

if (bookingBtn) {
    bookingBtn.classList.add("btn-disabled");
    bookingBtn.disabled = true;
    bookingBtn.innerText = "पहले रजिस्ट्रेशन करें 🔒";
}

if (bookingForm) {
    bookingForm.addEventListener("submit", function(e) {
        if (bookingBtn.disabled) {
            e.preventDefault();
            alert("❌ कृपया पहले ऊपर वाला पंजीकरण फॉर्म भरें!");
            document.getElementById("ownerForm").scrollIntoView({ behavior: 'smooth' });
        }
    });
}

const ownerForm = document.getElementById("ownerForm");
if (ownerForm) {
    ownerForm.addEventListener("submit", function(e) {
        // रजिस्ट्रेशन सफल होने का संकेत (यहाँ आप अपना Fetch कॉल भी डाल सकते हैं)
        alert("✅ रजिस्ट्रेशन सफल! अब आप कारीगर बुक कर सकते हैं।");
        if (bookingBtn) {
            bookingBtn.classList.remove("btn-disabled");
            bookingBtn.disabled = false;
            bookingBtn.innerText = "बुकिंग कन्फर्म करें ✅";
            bookingBtn.style.backgroundColor = "#27ae60";
        }
    });
}

function showBookingForm() {
    var section = document.getElementById("booking-section");
    if (section) {
        // सेक्शन को दिखाने के लिए display ब्लॉक करें
        section.style.display = "block";
        
        // पेज को धीरे से स्क्रॉल करके फॉर्म पर ले जाने के लिए (Optional)
        section.scrollIntoView({ behavior: 'smooth' });
    }
}


