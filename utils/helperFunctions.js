// Function to update the report based on the current month and year of the cart items
const updateReport = (allUpdatedCartItems, reportOfThisYear) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    allUpdatedCartItems.forEach(item => {
        const { productName, quantity, createdAt } = item;
        
        const month = new Date(createdAt).getMonth() + 1;
        const year = new Date(createdAt).getFullYear();

        if (year === currentYear && month === currentMonth) {
            reportOfThisYear[productName][month - 1] += quantity;
        }
    });

    return reportOfThisYear;
};

module.exports = {
    updateReport
}