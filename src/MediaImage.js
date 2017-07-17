import React from 'react';
import './MediaImage.css';

export default class MediaImage extends React.Component {
	render() {
		const entity = this.props.contentState.getEntity(
			this.props.block.getEntityAt(0)
		);
		const { src } = entity.getData();
		// const type = entity.getType();

		return <img className="media-image" src={src} alt="draft"/>
	}
}