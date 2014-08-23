/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*global define, Please, console*/
/*eslint no-console:0 no-use-before-define:0*/

define(function(require) {

    //<webpack>
    require('famous-polyfills');
    require('bootstrap/dist/css/bootstrap.min.css');
    require('famous/core/famous.css');
    require('./styles.css');
    require('./index.html');
    //</webpack>

    // import dependencies
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var FastClick = require('famous/inputs/FastClick');
    var LayoutController = require('famous-flex/LayoutController');
    var LayoutUtility = require('famous-flex/LayoutUtility');
    var GridLayout = require('famous-flex-layouts/GridLayout');
    var NavBarLayout = require('famous-flex-layouts/NavBarLayout');
    var Dogs = require('./data/dogs/collection');
    var LayoutDockHelper = require('famous-flex/helpers/LayoutDockHelper');

    // create the main context
    var mainContext = Engine.createContext();

    // Create the shell
    var collection = [];
    var navbar = _createNavbar();
    var sidebar = _createSidebar();
    var collectionView = _createCollectionView(collection);
    var shell = _createShell({
        navbar: navbar,
        sidebar: sidebar,
        content: collectionView
    });
    mainContext.add(shell);

    // Add layout types
    _addCollectionLayouts();

    function _createShell(renderables) {
        return new LayoutController({
            layout: function(context, options) {
                var dock = new LayoutDockHelper(context);
                if (options.showSidebar) {
                    if (context.size[0] >= context.size[1]) {
                        dock.left(context.nodeById('sidebar'), 200);
                    }
                    else {
                        dock.bottom(context.nodeById('sidebar'), 200);
                    }
                }
                dock.top(context.nodeById('navbar'), 50);
                dock.fill(context.nodeById('content'));
            },
            dataSource: renderables
        });
    }

    function _createCollectionItem() {
        var imageUrl = Dogs[collection.length % Dogs.length];
        return new Surface({
            classes: ['image-frame'],
            content: '<span class="image-helper"></span><img src="' + imageUrl + '" class="image-content">'
        });
    }
    function _addCollectionItem() {
        if (collectionView) {
            var rightItems = navbar.getLayoutNodeById('rightItems');
            var insertSpec = LayoutUtility.cloneSpec(navbar.getLayoutNode(rightItems[1]).getSpec());
            insertSpec.opacity = 0;
            insertSpec.origin = [1, 0];
            insertSpec.align = [1, 0];
            collectionView.insert(-1, _createCollectionItem(), insertSpec);
        }
        else {
            collection.unshift(_createCollectionItem());
        }
    }

    function _removeCollectionItem() {
        var rightItems = navbar.getLayoutNodeById('rightItems');
        var removeSpec = LayoutUtility.cloneSpec(navbar.getLayoutNode(rightItems[0]).getSpec);
        removeSpec.opacity = 0;
        removeSpec.origin = [1, 0];
        removeSpec.align = [1, 0];
        collectionView.remove(0, removeSpec);
    }

    function _toggleSidebar() {
        shell.patchLayoutOptions({
            showSidebar: !shell.getLayoutOptions().showSidebar
        });
    }

    function _createButton(content) {
        return new Surface({
            size: [38, undefined],
            content: '<button type="button" class="btn btn-default">' + content + '</button>'
        });
    }

    function _createSidebar() {
        return new LayoutController({
            layout: function(context) {
                var dock = new LayoutDockHelper(context);
                if (context.size[0] < 300) {
                    dock.bottom(context.nodeById('details'), 200);
                }
                else {
                    dock.right(context.nodeById('details'), 200);
                }
                dock.fill(context.nodeById('list'));
            },
            dataSource: {
                'list': _createLayoutListView(),
                'details': _createLayoutDetailsView()
            }
        });
    }

    function _createNavbar() {
        var layoutController = new LayoutController({
            layout: NavBarLayout,
            layoutOptions: {
                margins: [8],
                itemSpacer: 5
            }
        });
        var background = new Surface({classes: ['navbar', 'navbar-default']});
        var title = new Surface({content: 'famous-flex', classes: ['title']});
        var addButton = _createButton('<i class="glyphicon glyphicon-plus"></i>');
        addButton.on('click', _addCollectionItem);
        var removeButton = _createButton('<i class="glyphicon glyphicon-minus"></i>');
        removeButton.on('click', _removeCollectionItem);
        var menuButton = _createButton('<i class="glyphicon glyphicon-tasks"></i>');
        menuButton.on('click', _toggleSidebar);
        layoutController.setDataSource({
            background: background,
            title: title,
            rightItems: [
                removeButton,
                addButton
            ],
            leftItems: [
                menuButton
            ]
        });
        return layoutController;
    }

    function _createCollectionView(collection) {
        for (var i = 0; i < 3; i++) {
            _addCollectionItem();
        }
        return new LayoutController({
            layout: GridLayout,
            layoutOptions: {
                columns: 3,
                rows: 3,
                gutter: [20, 20]
            },
            dataSource: collection
        });
    }

    function _createLayoutListView() {
        return new Surface({
            classes: ['navbar', 'navbar-default']
        });
    }

    function _createLayoutDetailsView() {
        return new Surface({
            classes: ['navbar', 'navbar-default']
        });
    }

    function _addCollectionLayouts() {
        _addCollectionLayout('GridLayout', GridLayout, [
            {name: 'columns',   value: 3, min: 1, max: 50},
            {name: 'rows',      value: 3, min: 1, max: 50},
            {name: 'gutter',    value: [20, 20], min: [0, 0], max: [100, 100]},
            {name: 'direction', value: 0, min: 0, max: 1}
        ]);
    }

    function _addCollectionLayout(text, layout, options) {
        // TODO
    }

});
