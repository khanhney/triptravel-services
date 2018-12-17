# crossdomain

  Render a `crossdomain.xml` so that Adobe Flash Player clients can make requests to your domain. More on this nonsense [here](http://www.adobe.com/devnet/adobe-media-server/articles/cross-domain-xml-for-streaming.html).

## Installation

    $ npm install crossdomain

## Example

```js
var crossdomain = require('crossdomain');

crossdomain({ domain: '*.segment.io' });
```

which returns:

```xml
<cross-domain-policy>
  <allow-http-request-headers-from domain="*.segment.io" headers="*"/>
  <site-control permitted-cross-domain-policies="all"/>
  <allow-access-from domain="*" secure="false"/>
</cross-domain-policy>
```

and `Express` integration works like this:

```js
var app = express();
var xml = crossdomain({ domain: '*.segment.io' });

app.all('/crossdomain.xml', function (req, res, next) {
  res.set('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml, 200);
});

app.listen(8000);
```

## API

### .crossdomain(options)
  
  Generate a `crossdomain.xml` file with custom `options`. `options.domain` is mandatory, and everything else is defaulted to this:

```js
{
    "allow-http-request-headers-from-headers": "*",
    "site-control-permitted-cross-domain-policies": "all",
    "allow-access-from-domain": "*",
    "allow-access-from-secure": "false"
}
```

Read more about these options in the [Adobe docs](http://www.adobe.com/devnet/adobe-media-server/articles/cross-domain-xml-for-streaming.html).

## License

```
WWWWWW||WWWWWW
 W W W||W W W
      ||
    ( OO )__________
     /  |           \
    /o o|    MIT     \
    \___/||_||__||_|| *
         || ||  || ||
        _||_|| _||_||
       (__|__|(__|__|
```