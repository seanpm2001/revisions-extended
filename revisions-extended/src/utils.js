/**
 * WordPress dependencies
 */
import { createRoot } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { format } from '@wordpress/date';
import { addQueryArgs } from '@wordpress/url';

export const pluginNamespace = 'revisions-extended';
export const pluginName = __( 'Revisions Extended', 'revisions-extended' );
export const pluginCustomPostType = 'revision';
import { POST_STATUS_PENDING, POST_STATUS_SCHEDULED } from './settings';
const CONTAINER_ID = 'revision-button-container';

export const getRestApiUrl = ( restBase, parentId ) => {
	return `revisions-extended/v1/${ restBase }/${ parentId }/revisions`;
};

export const getRestApiUrlV2 = ( revisionId ) => {
	return `wp/v2/revision/${ revisionId }`;
};

export const getEditUrl = ( postId ) => {
	return addQueryArgs( 'post.php', {
		post: postId,
		action: 'edit',
	} );
};

export const getAllRevisionUrl = ( type ) => {
	if ( ! type || ! type.length ) {
		return '';
	}

	if ( type.toLowerCase() === 'post' ) {
		return addQueryArgs( 'edit.php', {
			page: 'post-updates',
		} );
	}

	return addQueryArgs( 'edit.php', {
		post_type: type,
		page: `${ type }-updates`,
	} );
};

/**
 * Returns the link for the revision comparison page
 *
 * @param {string} revisionId
 * @return {string} Url
 */
export const getCompareLink = ( revisionId ) => {
	return addQueryArgs( 'revision.php', {
		page: 'compare-updates',
		revision_id: revisionId,
	} );
};

export const getFormattedDate = ( date ) => {
	return format( 'D, F j, Y G:i a', date );
};
export const getShortenedFormattedDate = ( date ) => {
	return format( 'M j, Y', date );
};

export const getStatusDisplay = ( postStatus, date ) => {
	if ( POST_STATUS_SCHEDULED === postStatus ) {
		return sprintf(
			// translators: %s: formatted date
			__( 'Scheduled for %s', 'revisions-extended' ),
			getShortenedFormattedDate( date )
		);
	}
	if ( POST_STATUS_PENDING === postStatus ) {
		return __( 'Pending', 'revisions-extended' );
	}
	return '';
};

export const clearLocalChanges = ( id ) => {
	// There's gotta be a better approach
	window.sessionStorage.removeItem( `wp-autosave-block-editor-post-${ id }` );
};

/**
 * Removes the button container if it exists
 */
const maybeRemoveContainer = () => {
	const container = document.getElementById( CONTAINER_ID );

	if ( container && container.parentElement ) {
		container.parentElement.removeChild( container );
	}
};

const insertContainer = ( btnDomRef ) => {
	const container = document.createElement( 'div' );
	container.id = CONTAINER_ID;

	btnDomRef.parentElement.insertBefore( container, btnDomRef.nextSibling );
};

/**
 * Insert an html element to the right.
 *
 * @param {HTMLElement} newNode Element to be added
 */
export const insertButton = ( newNode ) => {
	const btnDomRef = document.querySelector( '.editor-post-publish-button__button' );

	if ( ! btnDomRef ) {
		return;
	}

	// We may re-insert the same button if it state's changes, ie: disabled -> enabled
	maybeRemoveContainer();

	insertContainer( btnDomRef );


	const root = createRoot( document.getElementById( CONTAINER_ID ) );

	root.render( newNode );

};

/**
 * This unsets the `overflow` property on the edit-post-header element.
 * This is a hack to fix the issue where the dropdown menu is hidden.
 *
 * see: https://github.com/WordPress/revisions-extended/issues/121
 */
export const toggleEditPostHeaderVisibilityOn = () => {
	const header = document.querySelector( '.edit-post-header' );

	if ( ! header ) {
		return;
	}

	header.style.overflow = 'unset';
};

/**
 * This reset the `overflow` property on the edit-post-header element to 'hidden'.
 *
 * see: https://github.com/WordPress/revisions-extended/issues/121
 */
export const toggleEditPostHeaderVisibilityOff = () => {
	const header = document.querySelector( '.edit-post-header' );

	if ( ! header ) {
		return;
	}

	header.style.overflow = 'hidden';
};
