/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {

    export class CurlyRule extends AbstractRule {
        public isEnabled(): boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new CurlyWalker(syntaxTree));
        }
    }

    class CurlyWalker extends Lint.RuleWalker {
        static CURLY_FAILURE = "if/for/do/while statements must be braced";

        public visitForInStatement(node: TypeScript.ForInStatementSyntax): void {
            this.verifyStatementIsBraced(node.statement);
            super.visitForInStatement(node);
        }

        public visitForStatement(node: TypeScript.ForStatementSyntax): void {
            this.verifyStatementIsBraced(node.statement);
            super.visitForStatement(node);
        }

        public visitIfStatement(node: TypeScript.IfStatementSyntax): void {
            this.verifyStatementIsBraced(node.statement);
            super.visitIfStatement(node);
        }

        public visitElseClause(node: TypeScript.ElseClauseSyntax): void {
            if (node.statement.kind() !== TypeScript.SyntaxKind.IfStatement) {
                this.verifyStatementIsBraced(node.statement);
            }
            super.visitElseClause(node);
        }

        public visitDoStatement(node: TypeScript.DoStatementSyntax): void {
            this.verifyStatementIsBraced(node.statement);
            super.visitDoStatement(node);
        }

        public visitWhileStatement(node: TypeScript.WhileStatementSyntax): void {
            this.verifyStatementIsBraced(node.statement);
            super.visitWhileStatement(node);
        }

        private verifyStatementIsBraced(node: TypeScript.IExpressionSyntax) {
            var failure = null;
            var hasBraces = false;

            var childCount = node.childCount();
            if (childCount === 3) {
                if (node.childAt(0).kind() === TypeScript.SyntaxKind.FirstPunctuation &&
                    node.childAt(1).kind() === TypeScript.SyntaxKind.List &&
                    node.childAt(2).kind() === TypeScript.SyntaxKind.CloseBraceToken) {
                    hasBraces = true;
                }
            }

            if (!hasBraces) {
                this.addFailure(this.createFailure(this.position(), node.width(), CurlyWalker.CURLY_FAILURE));
            }
        }
    }

}