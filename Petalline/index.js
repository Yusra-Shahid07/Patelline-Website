window.addEventListener("scroll",()=>{
    let view=document.querySelector(".viewallbutton")
    let viewfromtop=view.offsetTop;
    const scrollTop=window.scrollY;
    const smallvalue=400;
    let coverdistance=scrollTop-(viewfromtop-smallvalue);
    if(coverdistance<0)
    {
        view.style.transform = `translateY(0px) rotate(0deg)`;
         view.style.transitionDuration = "0.3s";
        return;
    }
    
    const maxscroll=850;
    let progress=Math.min(coverdistance/maxscroll,1);
    let rotatedeg=progress*360;
    let translatey=progress*800;
    view.style.transform = `translateY(${translatey}px) rotate(${rotatedeg}deg)`;
    const time=`0.5s`
    view.style.transitionDuration=time;
    let viewbuttonClick=document.querySelector(".viewallbutton");
    viewbuttonClick.addEventListener("click",()=>{
        window.open("http://127.0.0.1:5500/aboutus.html");
    })
})

// window.addEventListener("scroll",()=>{
//     let view=document.querySelector(".viewbutton")
//     let viewfromtop=view.offsetTop;
//     const scrollTop=window.scrollY;
//     const smallvalue=200;
//     let coverdistance=scrollTop-(viewfromtop-smallvalue);
//     if(coverdistance<0)
//     {
//         view.style.transform = `translateY(0px) rotate(0deg)`;
//          view.style.transitionDuration = "0.3s";
//         return;
//     }
    
//     const maxscroll=450;
//     let progress=Math.min(coverdistance/maxscroll,1);
//     let rotatedeg=progress*360;
//     let translatey=progress*430;
//     view.style.transform = `translateY(${translatey}px) rotate(${rotatedeg}deg)`;
//     const time=`0.2s`
//     view.style.transitionDuration=time;
// })
let playbutton=document.querySelector(".playbutton");
let video=document.querySelector(".video");
video.addEventListener("mouseover",(e)=>{
    let rect=video.getBoundingClientRect();
    let x=e.clientX-rect.left;
    let y=e.clientY-rect.top;
    playbutton.style.left=`${x}px`;
    playbutton.style.top=`${y}px`;
})
// video.addEventListener("mouseleave",()=>{
//     playbutton.style.left=`0px`;
//     playbutton.style.top=`0px`;
// })









 function toggleExpand(element) {
            // Close all other expanded items with smooth animation
            const allItems = document.querySelectorAll('.news-item');
            allItems.forEach(item => {
                if (item !== element && item.classList.contains('expanded')) {
                    item.classList.remove('expanded');
                }
            });

            // Toggle current item
            element.classList.toggle('expanded');
            
            // Add click animation effect
            element.style.transform = 'scale(0.98)';
            setTimeout(() => {
                element.style.transform = '';
            }, 200);

            // Add ripple effect
            createRipple(element, event);
        }

        function createRipple(element, event) {
            const ripple = document.createElement('div');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(151, 7, 71, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            element.style.position = 'relative';
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        // function handleViewAll() {
        //     const button = document.querySelector('.viewbutton');
        //     button.style.transform = 'scale(0.9)';
        //     button.innerHTML = 'Loading...';
            
        //     setTimeout(() => {
        //         button.style.transform = 'scale(1.1)';
        //         button.innerHTML = 'VIEW ALL';
        //         setTimeout(() => {
        //             button.style.transform = '';
        //             alert('Redirecting to all news articles!');
        //         }, 200);
        //     }, 500);
        // }

        // // Add scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.news-item').forEach(item => {
            observer.observe(item);
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.news-item.expanded').forEach(item => {
                    item.classList.remove('expanded');
                });
            }
        });

        // Hover effects for better interaction
        document.querySelectorAll('.news-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                if (!this.classList.contains('expanded')) {
                    this.style.background = 'rgba(255, 255, 255, 0.05)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (!this.classList.contains('expanded')) {
                    this.style.background = '';
                }
            });
        });



window.addEventListener("DOMContentLoaded", () => {
// Sample images - you can replace these with your actual image URLs
let pics = [
    "/Assests/home/3.jpg",
    "/Assests/home/9.jpg",
    "/Assests/home/7.jpg",
    "/Assests/home/8.jpg",
    "/Assests/home/5.jpg",
    "/Assests/home/10.jpg",
    "/Assests/home/12.jpg",
    "/Assests/home/13.jpg",
    "/Assests/home/14.jpg"
];

let pic1 = document.querySelector(".featurespic1");
let pic2 = document.querySelector(".featurespic2");
let pic3 = document.querySelector(".featurespic3");

pic1.style.backgroundImage = `url("${pics[0]}")`;
pic2.style.backgroundImage = `url("${pics[1]}")`;
pic3.style.backgroundImage = `url("${pics[2]}")`;

let arrowleft = document.querySelector(".featuresarrowleft");
let arrowright = document.querySelector(".featuresarrowright");
let i = 0, j = 1, k = 2;
let maxvalue = 8;

arrowleft.onclick = () => {
    let currentBg = pic1.style.backgroundImage;
    for(let index = 0; index <= maxvalue; index++) {
        if(currentBg.includes(pics[index]) || currentBg.includes(encodeURIComponent(pics[index]))) {
            i = i - 1;
            j = j - 1; 
            k = k - 1;
            if(i < 0) i = maxvalue;
            if(j < 0) j = maxvalue;
            if(k < 0) k = maxvalue;
            
            pic1.classList.add("pic1animateclass");
            pic1.style.backgroundImage = `url("${pics[i]}")`;
            
            pic2.classList.add("pic2animateclass");
            pic2.style.backgroundImage = `url("${pics[j]}")`;
            
            pic3.classList.add("pic3newanimateclass");
            pic3.style.backgroundImage = `url("${pics[k]}")`;
            
            setTimeout(() => {
                pic1.classList.remove("pic1animateclass");
                pic2.classList.remove("pic2animateclass");
                pic3.classList.remove("pic3newanimateclass");
            }, 500);
            
            break;
        }
    }
}

arrowright.onclick = () => {
    let currentBg = pic1.style.backgroundImage;
    for(let index = 0; index <= maxvalue; index++) {
        if(currentBg.includes(pics[index]) || currentBg.includes(encodeURIComponent(pics[index]))) {
            i = i + 1;
            j = j + 1; 
            k = k + 1;
            if(i > maxvalue) i = 0;
            if(j > maxvalue) j = 0;
            if(k > maxvalue) k = 0;
            
            pic1.classList.add("pic1animateclass");
            pic1.style.backgroundImage = `url("${pics[i]}")`;
            
            pic2.classList.add("pic2animateclass");
            pic2.style.backgroundImage = `url("${pics[j]}")`;
            
            pic3.classList.add("pic3newanimateclass");
            pic3.style.backgroundImage = `url("${pics[k]}")`;
            
            setTimeout(() => {
                pic1.classList.remove("pic1animateclass");
                pic2.classList.remove("pic2animateclass");
                pic3.classList.remove("pic3newanimateclass");
            }, 500);
            
            break;
        }
    }
}

// Auto-slide functionality (optional)
let autoSlide = setInterval(() => {
    arrowright.click();
}, 5000);

// Pause auto-slide on hover
let sliderContainer = document.querySelector(".picsall");
sliderContainer.addEventListener("mouseenter", () => {
    clearInterval(autoSlide);
});

sliderContainer.addEventListener("mouseleave", () => {
    autoSlide = setInterval(() => {
        arrowright.click();
    }, 5000);
});
});