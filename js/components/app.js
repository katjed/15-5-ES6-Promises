App = React.createClass({
    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },

    handleSearch: function(searchingText) {  // 1
        this.setState({
            loading: true  // 2
        });
        var self = this;

        this.getGif(searchingText)
        .then(function(gif) {  // 3
            self.setState({  // 4
                loading: false,  // a
                gif: gif,  // b
                searchingText: searchingText  // c
            })
        })
        .catch(function(error) {
            console.error(error);
        })
    },

    getGif: function(searchingText, callback) {  // 1
        var GIPHY_API_URL = 'https://api.giphy.com';
        var GIPHY_PUB_KEY = 'QvxROZ84iSYOJuHIfKEQEn1dIAZqvJxe';

        return new Promise(
            function(resolve, reject) {
                var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;  // 2
                var xhr = new XMLHttpRequest();  // 3
                xhr.open('GET', url);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText).data; // 4
                        if (data.type === 'gif') {
                            var gif = {  // 5
                                url: data.fixed_width_downsampled_url,
                                sourceUrl: data.url
                            };
                            resolve(gif);  // 6
                        }
                        else {
                            reject(new Error('Gif not found!'));
                        }
                    } else {
                        reject(new Error(this.statusText));
                    }
                };
                xhr.send();
            }
        )
    },

    render: function() {

        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
          <div style={styles}>
                <h1>Wyszukiwarka GIFów!</h1>
                <p>Znajdź GIFa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne GIFy.</p>
                <Search onSearch={this.handleSearch} /> 
            <Gif
                loading={this.state.loading}
                url={this.state.gif.url}
                sourceUrl={this.state.gif.sourceUrl}
            />
          </div>
        );
    }
});