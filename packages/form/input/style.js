import { css } from '@dom'

function style(input) {
  return css`
		:host {
			align-items: start;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			gap: var(--spacing-nano);
			width: ${input.width};

			input {
				appearance: none;
				background-color: var(--color-master-lightest);
				border: var(--border-width-hairline) solid var(--color-master-light);
				border-radius: var(--border-radius-sm);
				box-sizing: border-box;
				color: var(--color-master-dark);
				font-family: var(--font-family-base);
				font-size: var(--font-size-xxs);
				font-weight: var(--font-weight-regular);
				height: 40px;
				line-height: var(--line-height-default);
				padding: var(--spacing_inset-nano) var(--spacing_inset-xs);
				width: 100%;

				&:active,
				&:hover {
					outline: 0;
				}

				&:focus {
					border-color: var(--color-primary);
					outline: 0;
				}

				&:disabled,
				&:read-only {
					background-color: var(--color-master-lighter);
					border-color: var(--color-master-light);
					box-shadow: none;
					color: var(--color-master);
				}

				&::placeholder {
					color: var(--color-master);
				}

				&:-webkit-autofill,
				&:-webkit-autofill:hover,
				&:-webkit-autofill:focus,
				&:-webkit-autofill:active {
					transition: background-color 9999999999s ease-in-out 0s;
				}
			}

			input[type='number']::-webkit-inner-spin-button,
			input[type='number']::-webkit-outer-spin-button {
				appearance: none;
				margin: 0;
			}
		}

		:host(:state(hidden)) {
			display: none;
		}

		:host(:state(invalid)) {
			input {
				border-color: var(--color-danger);
			}

			slot[name='helper'] {
				display: none;
			}
		}
	`
}

export default style
