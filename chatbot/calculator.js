// MAINUL-X Calculator - Md. Mainul Islam (M41NUL)

function calculate(expression) {
    try {
        // Remove spaces and validate
        const expr = expression.replace(/\s+/g, '');
        
        // Only allow numbers and basic operators
        if (!/^[0-9+\-*/().]+$/.test(expr)) {
            return '❌ Invalid expression';
        }
        
        // Use Function instead of eval for safety
        const result = new Function('return ' + expr)();
        return `🧮 ${expression} = ${result}`;
        
    } catch (error) {
        return '❌ Calculation error';
    }
}

function isMathQuery(text) {
    return text.match(/[0-9+\-*/().]/) && 
           (text.includes('+') || text.includes('-') || 
            text.includes('*') || text.includes('/'));
}

window.calculate = calculate;
window.isMathQuery = isMathQuery;
console.log('✅ Calculator loaded');
