import { useRef, useEffect } from "react"
import { gsap } from "gsap";

const CustomCursor = () => {
  // ==================== المراجع ====================
  const cursorRef = useRef(null);
  const cursorBorderRef = useRef(null);
 
  // ==================== تأثيرات حركة المؤشر ====================
  useEffect(() => {
    // التحقق من الأجهزة المحمولة هنا بدلاً من أعلى المكون
    const isMobile = typeof window !== 'undefined' &&
      window.matchMedia("(max-width:768px)").matches
    
    if (isMobile) {
      return; // لا تفعل أي شيء إذا كان موبايل
    }
    
    const cursor = cursorRef.current;
    const cursorBorder = cursorBorderRef.current;
    
    // تهيئة موضع المؤشرين (المركز والحدود)
    gsap.set([cursor, cursorBorder], {
      xPercent: -50,
      yPercent: -50,
    })
   
    // ==================== إنشاء حركة سلسة للمؤشرات ====================
    // حركة سريعة للمؤشر الداخلي
    const xTo = gsap.quickTo(cursor, "x", {
      duration: 0.2, ease: "power3.out"
    })
    const yTo = gsap.quickTo(cursor, "y", {
      duration: 0.2, ease: "power3.out"
    })
    
    // حركة أبطأ للحدود الخارجية (تأثير التتبع)
    const xToBorder = gsap.quickTo(cursorBorder, "x", {
      duration: 0.5, ease: "power3.out"
    })
    const yToBorder = gsap.quickTo(cursorBorder, "y", {
      duration: 0.5, ease: "power3.out"
    })
 
    // ==================== معالج حركة الماوس ====================
    const handleMouseMove = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
      xToBorder(e.clientX)
      yToBorder(e.clientY)
    }
   
    // ==================== معالج الضغط على الماوس ====================
    // تصغير المؤشر عند الضغط
    const handleMouseDown = () => {
      gsap.to([cursor, cursorBorder], {
        scale: 0.6,
        duration: 0.2,
      })
    }
   
    // ==================== معالج رفع الضغط عن الماوس ====================
    // إرجاع المؤشر لحجمه الطبيعي
    const handleMouseUp = () => {
      gsap.to([cursor, cursorBorder], {
        scale: 1,
        duration: 0.2,
      })
    }
   
    // ==================== إضافة مستمعي الأحداث ====================
    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    
    // ==================== تنظيف المستمعين عند إلغاء التثبيت ====================
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])
 
  // ==================== عناصر المؤشر المخصص ====================
  return (
    <>
      {/* المؤشر الداخلي (نقطة بيضاء صغيرة) */}
      <div
        className="fixed top-0 left-0 w-[20px] h-[20px] bg-white rounded-full pointer-events-none z-[999] mix-blend-difference"
        ref={cursorRef}
      />
      
      {/* الحدود الخارجية (دائرة أكبر) */}
      <div
        ref={cursorBorderRef}
        className="fixed top-0 left-0 w-[40px] h-[40px] border rounded-full border-white pointer-events-none z-[999] mix-blend-difference opacity-50"
      />
    </>
  )
}

export default CustomCursor