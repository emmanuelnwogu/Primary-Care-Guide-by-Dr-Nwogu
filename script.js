// script.js

document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const searchInfo = document.getElementById('searchInfo');
    let highlightedElements = [];

    searchButton.addEventListener('click', performSearch);
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            performSearch();
        }
    });

    function performSearch() {
        const searchText = searchBox.value.trim().toLowerCase();
        if (searchText) {
            removeHighlights();
            highlightText(document.body, searchText);
            if (highlightedElements.length > 0) {
                searchInfo.textContent = `Found ${highlightedElements.length} instances of "${searchText}". Use 'Enter' to navigate.`;
            } else {
                searchInfo.textContent = `No instances of "${searchText}" found.`;
            }
        } else {
            removeHighlights();
            searchInfo.textContent = '';
        }
    }

    function highlightText(element, searchText) {
        const regex = new RegExp(`(${searchText}).*`, 'gi'); // Match partial word matches
        traverseAndHighlight(element, regex);
    }

    function traverseAndHighlight(element, regex) {
        if (element.nodeType === Node.TEXT_NODE) {
            const matches = element.textContent.match(regex);
            if (matches) {
                matches.forEach(match => {
                    const span = document.createElement('span');
                    span.className = 'highlight';
                    span.textContent = match;
                    element.parentNode.insertBefore(span, element.nextSibling);
                    highlightedElements.push(span);
                });
            }
        } else if (element.nodeType === Node.ELEMENT_NODE) {
            element.childNodes.forEach(child => traverseAndHighlight(child, regex));
        }
    }

    function removeHighlights() {
        highlightedElements.forEach(span => {
            span.parentNode.removeChild(span);
        });
        highlightedElements = [];
    }

    // Navigate through highlighted elements
    let currentHighlightIndex = 0;
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && highlightedElements.length > 0) {
            highlightedElements[currentHighlightIndex].classList.remove('current');
            currentHighlightIndex = (currentHighlightIndex + 1) % highlightedElements.length;
            highlightedElements[currentHighlightIndex].classList.add('current');
            highlightedElements[currentHighlightIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});
