/*
 * JavaScript Boilerplate for News Aggregator Project
 * 
 * This JavaScript file is part of the Web APIs assignment.
 * Your task is to complete the functions with appropriate module pattern, observer pattern, singleton pattern.
 * 
 * Follow the TODO prompts and complete each section to ensure the
 * News Aggregator App works as expected.
 */

// Singleton Pattern: ConfigManager
const ConfigManager = (function() {
    let instance;

    function createInstance() {
        return {
            theme: 'dark',
            apiUrl: 'https://newsapi.org/v2/top-headlines',
            apiKey: '219bb072ed624e278f3e6627523326ec' // TODO: Replace with your NewsAPI key
        };
    }

    // TODO: Return getInstance function
    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };

})();

// Module Pattern: NewsFetcher
const NewsFetcher = (function () {
    // TODO: Create config object with getInstance of ConfigManager
    const Config = ConfigManager.getInstance();
    
    function fetchArticles() {
        // TODO: return fetch data adjusted for only articles
        return fetch(`${Config.apiUrl}?country=us&apiKey=${Config.apiKey}`)
            .then(
                response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
            })
            .then(
                data => data.articles
            )
            // Error handling
            .catch(error => console.error('Error fetching articles:', error));
    }

    return {
        getArticles: fetchArticles
    };
})();

// Observer Pattern: NewsFeed
function NewsFeed() {
    this.observers = [];
    this.articles = [];
}

// TODO: Create NewsFeed prototype
NewsFeed.prototype = {
    subscribe: function(fn) {
        this.observers.push(fn);
    },
    unsubscribe: function(fn) {
        this.observers = this.observers.filter(observer => observer !== fn);
    },
    addArticle: function(article) {
        this.articles.push(article);
        this.notify(article);
    },
    notify: function(article) {
        this.observers.forEach(observer => observer(article));
    }
};


// Instantiate the NewsFeed
const newsFeed = new NewsFeed();

// Observer 1: Update Headline
function updateHeadline(article) {
    const headlineElement = document.getElementById('headline').querySelector('p');
    headlineElement.textContent = article.title;
}

// Observer 2: Update Article List
function updateArticleList(article) {
    const articleListElement = document.getElementById('articles');
    const listItem = document.createElement('li');
    listItem.textContent = article.title;
    articleListElement.appendChild(listItem);
}

// TODO: Subscribe Observers
newsFeed.subscribe(updateHeadline);
newsFeed.subscribe(updateArticleList);


// Fetch and display articles
NewsFetcher.getArticles().then(articles => {
    articles.forEach(article => {
        newsFeed.addArticle(article);
    });
});

// Display Config Info
const configInfo = ConfigManager.getInstance();
document.getElementById('configInfo').textContent = `Theme: ${configInfo.theme}`;

