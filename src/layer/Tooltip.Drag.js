import {Handler} from '../core/Handler';
import * as DomUtil from '../dom/DomUtil';
import {Draggable} from '../dom/Draggable';

/*
 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
 */


/* @namespace Marker
 * @section Interaction handlers
 *
 * Interaction handlers are properties of a marker instance that allow you to control interaction behavior in runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
 *
 * ```js
 * marker.dragging.disable();
 * ```
 *
 * @property dragging: Handler
 * Marker dragging handler (by both mouse and touch).
 */

export var TooltipDrag = Handler.extend({
	initialize: function (marker) {
		this._tooltip = marker;
	},

	addHooks: function () {
		// var icon = this._tooltip._icon;

		if (!this._draggable) {

			this._draggable = new Draggable(this._tooltip._contentNode, this._tooltip._contentNode, true);
		}

		this._draggable.on({
			dragstart: this._onDragStart,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).enable();

		// L.DomUtil.addClass(icon, 'leaflet-marker-draggable');
	},

	removeHooks: function () {
		this._draggable.off({
			dragstart: this._onDragStart,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).disable();

		// if (this._tooltip._icon) {
		// 	L.DomUtil.removeClass(this._tooltip._icon, 'leaflet-marker-draggable');
		// }
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	_onDragStart: function () {
		// @section Dragging events
		// @event dragstart: Event
		// Fired when the user starts dragging the marker.

		// @event movestart: Event
		// Fired when the marker starts moving (because of dragging).

		this._oldLatLng = this._tooltip.getLatLng();
		this._tooltip
			.fire('movestart')
			.fire('dragstart');

		this._contStartPos = DomUtil.getPosition(this._tooltip._container);
	},

	_onDrag: function (e) {

		// @event drag: Event
		// Fired repeatedly while the user drags the marker.
		this._tooltip
			.fire('move', e)
			.fire('drag', e);

	},

	_onDragEnd: function (e) {
		// @event dragend: DragEndEvent
		// Fired when the user stops dragging the marker.

		// @event moveend: Event
		// Fired when the marker stops moving (because of dragging).
		delete this._oldLatLng;
		this._tooltip
			.fire('moveend')
			.fire('dragend', e);

		this._contFinishPos = DomUtil.getPosition(this._tooltip._container);

		var tooltip = this._tooltip,
		map = tooltip._map,
		pos = DomUtil.getPosition(tooltip._contentNode),
		sourcePos = map.latLngToLayerPoint(tooltip._source._latlng),
		offset = pos.subtract(sourcePos);

		var container = tooltip._container,
		tooltipHeight = container.offsetHeight,
		tooltipAnchor = tooltip._source._getTooltipAnchor();
		offset = offset.subtract(tooltipAnchor);
		offset = offset.add([0, tooltipHeight / 2]);
		tooltip.options.offset = offset;
	}


});
